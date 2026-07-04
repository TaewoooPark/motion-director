#!/usr/bin/env node
// uiforge-sourcemap — Tier A: recover a site's REAL original source from JavaScript source maps.
// When a site ships (or leaks) source maps — including "hidden" maps whose comment was stripped
// but whose .map is still on the CDN — their `sourcesContent` holds the actual pre-transpile
// .tsx/.ts/.vue/.svelte with original names, comments, and src/ paths. This reads the archive's
// JS, follows each sourceMappingURL (comment → header → blind <asset>.map probe), fetches+validates
// the map, and rebuilds the source tree. Highest-fidelity path — recovered, not reconstructed.
// Zero-dep (a source map is JSON; recovery only needs sources[] + sourcesContent[]).
//
// Usage:
//   node uiforge-sourcemap.mjs <archiveDir> --out-dir ./recovered-src [--include-vendor] [--no-fetch] [--json]

import process from 'node:process'
import path from 'node:path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

const argv = process.argv.slice(2)
if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
  console.log(`\n  uiforge-sourcemap — recover a site's real original source from JS source maps (Tier A).\n\n  node uiforge-sourcemap.mjs <archiveDir> --out-dir ./recovered-src [--include-vendor] [--no-fetch] [--json]\n`)
  process.exit(argv.length ? 0 : 1)
}
const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
const outDir = valAt('--out-dir') || './recovered-src'
const includeVendor = argv.includes('--include-vendor')
const noFetch = argv.includes('--no-fetch')
const jsonOut = argv.includes('--json')
const valueIdx = new Set(); for (const nm of ['--out-dir']) { const i = argv.indexOf(nm); if (i >= 0) valueIdx.add(i + 1) }
const archive = argv.find((a, idx) => !a.startsWith('--') && !valueIdx.has(idx))
if (!archive || !existsSync(path.join(archive, 'index.json'))) { console.error('  need an archive dir (with index.json)'); process.exit(1) }

async function fetchTO(url, ms) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms)
  try { return await fetch(url, { signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0' } }) } catch { return null } finally { clearTimeout(t) }
}
// clamp a source-map path to a safe relative path under the out dir (defends against ../ traversal)
function safePath(s) {
  return s.replace(/^webpack:\/\//, '').replace(/^https?:\/\//, '').replace(/^[a-z]+:\/\//, '')
    .replace(/^\/+/, '').replace(/\?.*$/, '').replace(/\0/g, '')
    .split('/').filter(seg => seg && seg !== '..' && seg !== '.').join('/')
}
const isVendor = s => /(^|\/)(node_modules|webpack)\//.test(s) || /\/\.pnpm\//.test(s)

async function run() {
  const B = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', C = '\x1b[36m', Y = '\x1b[33m', X = '\x1b[0m'
  const idx = JSON.parse(readFileSync(path.join(archive, 'index.json'), 'utf8'))
  const fdir = existsSync(path.join(archive, 'files')) ? 'files' : 'data'
  const jsEntries = (idx.entries || []).filter(e => /javascript|ecmascript/.test(e.ct || '') && e.file)
  const byUrl = new Map(); for (const e of idx.entries || []) byUrl.set(e.url, e)

  if (!jsonOut) console.log(`\n  ${B}UIForge sourcemap${X} ${D}← ${archive} (${jsEntries.length} JS assets)${X}`)

  const maps = []             // { mapUrl, map }
  const seenMapUrls = new Set()
  let probed = 0, fetched = 0, fromArchive = 0
  for (const e of jsEntries) {
    const abs = path.join(archive, fdir, e.file)
    let body = ''; try { body = readFileSync(abs, 'latin1') } catch { continue }
    // candidate map URLs: comment ref, SourceMap header, blind <asset>.map
    const cands = []
    const m = body.slice(-4096).match(/[#@]\s*sourceMappingURL=([^\s'"]+)/)
    if (m) cands.push(m[1])
    const hdr = (e.headers && (e.headers['sourcemap'] || e.headers['x-sourcemap']))
    if (hdr) cands.push(hdr)
    cands.push(e.url.split('?')[0] + '.map')            // hidden-map blind probe
    for (const cand of cands) {
      let mapUrl; try { mapUrl = /^data:/.test(cand) ? cand : new URL(cand, e.url).href } catch { continue }
      if (seenMapUrls.has(mapUrl)) continue
      seenMapUrls.add(mapUrl); probed++
      let text = null
      if (mapUrl.startsWith('data:')) { try { text = Buffer.from(mapUrl.split(',')[1], /;base64/.test(mapUrl) ? 'base64' : 'utf8').toString('utf8') } catch {} }
      else if (byUrl.has(mapUrl)) { try { text = readFileSync(path.join(archive, fdir, byUrl.get(mapUrl).file), 'utf8'); fromArchive++ } catch {} }   // map already archived
      else if (!noFetch) { const r = await fetchTO(mapUrl, 8000); if (r && r.ok) { text = await r.text().catch(() => null); if (text) fetched++ } }
      if (!text) continue
      let map; try { map = JSON.parse(text) } catch { continue }
      if (map.version === 3 && Array.isArray(map.sources) && Array.isArray(map.sourcesContent) && map.sourcesContent.some(Boolean)) { maps.push({ mapUrl, map }); break }
    }
  }

  // materialize the recovered source tree
  mkdirSync(outDir, { recursive: true })
  const written = new Set(); let app = 0, vendor = 0
  const appFiles = []
  for (const { map } of maps) {
    for (let i = 0; i < map.sources.length; i++) {
      const content = map.sourcesContent[i]; if (content == null) continue
      const src = map.sources[i]; const vend = isVendor(src)
      if (vend && !includeVendor) { vendor++; continue }
      const rel = safePath(src); if (!rel || written.has(rel)) continue
      const dest = path.join(outDir, rel)
      if (!path.resolve(dest).startsWith(path.resolve(outDir))) continue    // traversal guard
      try { mkdirSync(path.dirname(dest), { recursive: true }); writeFileSync(dest, content); written.add(rel); if (vend) vendor++; else { app++; if (/\.(tsx|jsx|vue|svelte|ts)$/.test(rel)) appFiles.push(rel) } } catch {}
    }
  }

  // infer client dependencies from bare import specifiers in recovered sources (a bonus signal)
  const deps = new Set()
  for (const rel of written) {
    if (isVendor(rel)) continue
    try {
      const t = readFileSync(path.join(outDir, rel), 'utf8')
      for (const mm of t.matchAll(/(?:from|import)\s*['"]([^'".][^'"]*)['"]/g)) {
        let d = mm[1]; if (d.startsWith('.') || d.startsWith('/') || d.startsWith('~') || d.startsWith('@/')) continue
        d = d.startsWith('@') ? d.split('/').slice(0, 2).join('/') : d.split('/')[0]; deps.add(d)
      }
    } catch {}
  }
  writeFileSync(path.join(outDir, 'RECOVERED.md'), `# Recovered source (Tier A — from source maps)\n\nThe **real original source** of ${idx.start}, recovered from shipped/leaked JavaScript source maps (\`sourcesContent\`). This is the client \`src/\` tree with original file names, comments, and types — recovered, not reconstructed.\n\n- **${app}** application source files${includeVendor ? ` + ${vendor} vendor` : ` (+${vendor} vendor skipped — pass --include-vendor)`}.\n- Not included (not in client maps): package.json, build config, environment, server/SSR code.\n- Inferred client dependencies (from imports): ${[...deps].sort().slice(0, 40).join(', ') || '—'}\n\n⚠️ Recovering and reusing another site's proprietary source has copyright/ToS implications — for study or redesign, not wholesale re-publishing.\n`)

  const result = { ok: true, archive, mapsFound: maps.length, probed, fetched, fromArchive, appFiles: app, vendorFiles: vendor, outDir, sampleAppFiles: appFiles.slice(0, 20), inferredDeps: [...deps].sort() }
  if (jsonOut) { console.log(JSON.stringify(result, null, 2)); return }
  console.log(`    ${C}maps${X}     ${maps.length ? G : Y}${maps.length}${X} usable ${D}(probed ${probed}${fetched ? `, fetched ${fetched}` : ''}${fromArchive ? `, ${fromArchive} from archive` : ''})${X}`)
  if (!maps.length) { console.log(`    ${Y}no source maps with content — this site strips them. Use Tier B (uiforge-restore) instead.${X}\n`); return }
  console.log(`    ${C}recovered${X} ${G}${app}${X} app source files${D}${includeVendor ? `, ${vendor} vendor` : ` (+${vendor} vendor skipped)`}${X}`)
  if (appFiles.length) { console.log(`    ${C}e.g.${X}      ${D}${appFiles.slice(0, 6).join('\n              ')}${X}`) }
  console.log(`    ${C}→${X} ${G}${outDir}/${X}  ${D}(real original source — see RECOVERED.md)${X}\n`)
}
run()
