#!/usr/bin/env node
// uiforge-detect — fingerprint a site's stack from an ARCHIVE (or a single .html file), offline.
// No live site, no deps. Reads the archived main document + asset paths and matches verified
// signals (Next/Nuxt/SvelteKit/Astro/Remix/Gatsby/Angular/Vue/React-Vite/CRA/static) plus
// Tailwind usage and the rendering mode. This drives uiforge-restore's output idiom + expectations.
//
// Usage:
//   node uiforge-detect.mjs <archiveDir│file.html> [--json]

import process from 'node:process'
import path from 'node:path'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'

const argv = process.argv.slice(2)
if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
  console.log(`\n  uiforge-detect — fingerprint a site's stack from an archive (offline, no deps).\n\n  node uiforge-detect.mjs <archiveDir│file.html> [--json]\n`)
  process.exit(argv.length ? 0 : 1)
}
const jsonOut = argv.includes('--json')
const input = argv.find(a => !a.startsWith('--'))

// ---- load the archived main HTML + the list of asset paths (URLs) ----
export function loadArchive(input) {
  let html = '', assetPaths = [], origin = '', jsFiles = []
  const st = existsSync(input) ? statSync(input) : null
  if (st && st.isDirectory()) {
    const idxPath = path.join(input, 'index.json')
    if (existsSync(idxPath)) {
      const idx = JSON.parse(readFileSync(idxPath, 'utf8'))
      origin = idx.origin || ''
      assetPaths = (idx.entries || []).map(e => e.url)
      const fdir = existsSync(path.join(input, 'files')) ? 'files' : 'data'
      // resolve absolute paths of the archived JS assets (for sourcemap scanning)
      jsFiles = (idx.entries || []).filter(e => /javascript|ecmascript/.test(e.ct || '') && e.file)
        .map(e => path.join(input, fdir, e.file)).filter(existsSync)
      // main document = the html entry matching startNorm, else first html
      const norm = u => { try { const x = new URL(u); for (const p of ['_rsc', '__nextDataReq', '_', 'cb', 'ts', 'timestamp']) x.searchParams.delete(p); return x.origin + x.pathname + (x.search || '') } catch { return u } }
      const doc = (idx.entries || []).find(e => norm(e.url) === idx.startNorm && (e.ct || '').includes('html')) || (idx.entries || []).find(e => (e.ct || '').includes('text/html'))
      if (doc && existsSync(path.join(input, fdir, doc.file))) html = readFileSync(path.join(input, fdir, doc.file), 'utf8')
      else { // fallback: any index.html under files/
        const guess = walkFind(path.join(input, fdir), f => /index\.html$/.test(f))
        if (guess) html = readFileSync(guess, 'utf8')
      }
    } else {
      const guess = walkFind(input, f => /\.html$/.test(f))
      if (guess) html = readFileSync(guess, 'utf8')
    }
  } else if (st) {
    html = readFileSync(input, 'utf8')
  }
  return { html, assetPaths, origin, jsFiles }
}

// Count how many archived JS assets carry a sourceMappingURL (the Tier-A source-recovery signal).
// The reference lives in the JS body's tail, so sample real files rather than URLs/HTML.
function scanSourcemapRefs(jsFiles) {
  let refs = 0, scanned = 0
  for (const f of jsFiles.slice(0, 60)) {
    try { const b = readFileSync(f); const tail = b.slice(-2048).toString('latin1'); scanned++; if (/[#@]\s*sourceMappingURL=/.test(tail)) refs++ } catch {}
  }
  return { refs, scanned }
}
function walkFind(dir, pred, depth = 0) {
  if (!existsSync(dir) || depth > 6) return null
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name); let s; try { s = statSync(p) } catch { continue }
    if (s.isDirectory()) { const r = walkFind(p, pred, depth + 1); if (r) return r }
    else if (pred(p)) return p
  }
  return null
}

// ---- the fingerprint rules (verified signals) ----
const FRAMEWORKS = [
  { id: 'next', name: 'Next.js', react: true, sig: [
    [/self\.__next_f/, 'self.__next_f (RSC stream)'], [/id="__next"/, '#__next'], [/__NEXT_DATA__/, '__NEXT_DATA__'],
    [/\/_next\/static\//, '/_next/static/'], [/next-route-announcer/, 'next-route-announcer'] ] },
  { id: 'nuxt', name: 'Nuxt', vue: true, sig: [
    [/id="__nuxt"/, '#__nuxt'], [/data-server-rendered/, 'data-server-rendered'], [/window\.__NUXT__/, '__NUXT__'], [/\/_nuxt\//, '/_nuxt/'] ] },
  { id: 'sveltekit', name: 'SvelteKit', svelte: true, sig: [
    [/\/_app\/immutable\//, '/_app/immutable/'], [/__sveltekit_/, '__sveltekit_'] ] },
  { id: 'astro', name: 'Astro', sig: [ [/<astro-island/, '<astro-island>'], [/\/_astro\//, '/_astro/'] ] },
  { id: 'remix', name: 'Remix/React-Router', react: true, sig: [ [/__remixContext/, '__remixContext'], [/__remixManifest/, '__remixManifest'] ] },
  { id: 'gatsby', name: 'Gatsby', react: true, sig: [ [/id="___gatsby"/, '#___gatsby'], [/\/page-data\//, '/page-data/'] ] },
  { id: 'angular', name: 'Angular', sig: [
    [/\sng-version="[\d.]+/, 'ng-version'], [/_nghost-[a-z0-9-]+/i, '_nghost-*'], [/_ngcontent-[a-z0-9-]+/i, '_ngcontent-*'], [/<[a-z]+-root[\s>]/i, '<*-root>'] ] },
  { id: 'cra', name: 'Create React App', react: true, sig: [
    [/\/static\/js\/main\.[a-f0-9]+\.(chunk\.)?js/, '/static/js/main.[hash].js'], [/You need to enable JavaScript to run this app/, 'CRA noscript'] ] },
  { id: 'vue', name: 'Vue', vue: true, sig: [ [/data-v-[a-f0-9]{6,}/, 'data-v-* (scoped)'], [/__VUE__/, '__VUE__'] ] },
]
// generic React (last resort — after the specific meta-frameworks above)
const REACT_GENERIC = [ [/data-reactroot/, 'data-reactroot'], [/<!--\$--?>/, 'React18 Suspense marker'], [/id="root"><\/div>/, 'empty #root'] ]
const VITE = [ [/\/assets\/index-[\w-]{6,}\.js/, '/assets/index-[hash].js'], [/rel="modulepreload"[^>]+\/assets\//, 'modulepreload /assets/'] ]
const TW_TOKENS = ['flex', 'items-center', 'justify-', 'rounded-', 'px-', 'py-', 'gap-', 'text-sm', 'font-medium', 'grid-cols-', 'space-y-', 'w-full']

export function detect(input) {
  const { html, assetPaths, origin, jsFiles } = loadArchive(input)
  const hay = html + '\n' + assetPaths.join('\n')
  if (!html) return { ok: false, error: 'no HTML found in input' }
  const scores = []
  for (const fw of FRAMEWORKS) {
    const hits = fw.sig.filter(([re]) => re.test(hay)).map(([, label]) => label)
    if (hits.length) scores.push({ id: fw.id, name: fw.name, hits, react: !!fw.react, vue: !!fw.vue, svelte: !!fw.svelte })
  }
  // generic React / Vite as supporting evidence
  const reactHits = REACT_GENERIC.filter(([re]) => re.test(hay)).map(([, l]) => l)
  const viteHits = VITE.filter(([re]) => re.test(hay)).map(([, l]) => l)
  let best = scores.sort((a, b) => b.hits.length - a.hits.length)[0]
  let family = 'unknown', react = false, vue = false, svelte = false
  if (best) { family = best.id; react = best.react; vue = best.vue; svelte = best.svelte }
  else if (reactHits.length || viteHits.length) { family = viteHits.length ? 'react-vite' : 'react'; react = true }

  // rendering mode
  const bodyText = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const emptyRoot = /<div id="(root|__next|app|___gatsby)"><\/div>/.test(html)
  const rendering = family === 'unknown' && !react && !vue && !svelte ? 'static'
    : (bodyText.length > 400 && !emptyRoot) ? 'ssr/ssg' : (emptyRoot ? 'csr' : 'ssr/ssg')

  // bundler hint
  const bundler = /\/assets\/index-[\w-]{6,}\.(js|css)/.test(hay) ? 'vite'
    : /main-[A-Z0-9]{8}\.js/.test(hay) ? 'angular-esbuild'
    : /\/static\/js\/main\.[a-f0-9]+/.test(hay) ? 'webpack (CRA)'
    : /\/_next\/static\//.test(hay) ? 'next'
    : 'unknown'

  // Tailwind usage (utility-class density in the rendered HTML)
  const twCounts = {}; let twTotal = 0
  for (const t of TW_TOKENS) { const c = (html.match(new RegExp('[\\s"\']' + t.replace(/[-]/g, '\\-'), 'g')) || []).length; twCounts[t] = c; twTotal += c }
  const tailwind = twTotal >= 40   // empirically, real Tailwind sites blow way past this

  // sourcemap availability (are maps referenced by the archived JS bodies? → Tier-A viable)
  const { refs: mapRefs, scanned: mapScanned } = scanSourcemapRefs(jsFiles || [])

  return {
    ok: true, input, origin,
    stack: best?.name || (family === 'react-vite' ? 'React + Vite' : family === 'react' ? 'React' : 'Static / hand-written HTML'),
    family, react, vue, svelte, rendering, bundler, tailwind, tailwindTokens: twTotal,
    sourcemapRefs: mapRefs, sourcemapScanned: mapScanned,
    signals: [...(best?.hits || []), ...reactHits.map(h => 'react:' + h), ...viteHits.map(h => 'vite:' + h)],
    // recommended restore output idiom
    recommend: family === 'unknown' && !react && !vue ? 'static-html'
      : (react || family === 'next' || family === 'cra' || family === 'remix' || family === 'gatsby') ? 'react'
      : vue ? 'vue-or-html' : svelte ? 'html' : 'react',
  }
}

if (input) {
  const r = detect(input)
  if (jsonOut) { console.log(JSON.stringify(r, null, 2)); process.exit(r.ok ? 0 : 2) }
  const B = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', C = '\x1b[36m', Y = '\x1b[33m', X = '\x1b[0m'
  if (!r.ok) { console.error(`  ${r.error}`); process.exit(2) }
  console.log(`\n  ${B}stack${X}       ${G}${r.stack}${X}`)
  console.log(`  ${C}rendering${X}   ${r.rendering}   ${D}bundler: ${r.bundler}${X}`)
  console.log(`  ${C}tailwind${X}    ${r.tailwind ? G + 'yes' + X + D + ' (' + r.tailwindTokens + ' utility hits — classes can be kept verbatim)' : Y + 'no/low' + X + D + ' (keep real CSS)'}${X}`)
  console.log(`  ${C}sourcemaps${X}  ${r.sourcemapRefs ? G + r.sourcemapRefs + '/' + r.sourcemapScanned + ' sampled JS ref .map' + X + D + ' (Tier-A source recovery viable — fetch the maps)' : D + '0/' + r.sourcemapScanned + ' sampled (none)'}${X}`)
  console.log(`  ${C}signals${X}     ${D}${r.signals.slice(0, 8).join(', ') || 'none'}${X}`)
  console.log(`  ${C}→ restore as${X} ${B}${r.recommend}${X}\n`)
}
