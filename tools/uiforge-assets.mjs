#!/usr/bin/env node
// uiforge-assets — stage 7 of the clone pipeline: make a clone SELF-CONTAINED.
//
// A capture references external assets (images via <img src>, CSS background-image
// url()s, the @font-face src URLs, canvas-recording .webm). Left as network URLs the
// exported clone breaks offline and rots when the origin changes. This downloads every
// referenced asset into <dest>/ and hands back a url→local-path map + rewrite helpers the
// exporter uses to point the project at /assets/… instead of the origin.
//
// Every fetch is hard-bounded (AbortController) so one slow/hanging URL can't stall a run.
//
// Usage:
//   node uiforge-assets.mjs capture.json --dest ./clone/public [--max 120]

import process from 'node:process'
import path from 'node:path'
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'

const PER_ASSET_MS = 6000   // hard timeout per download — the anti-stall guard
const MAX_BYTES = 8 * 1024 * 1024
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'font/woff2': 'woff2', 'font/woff': 'woff', 'font/ttf': 'ttf', 'application/font-woff2': 'woff2', 'video/webm': 'webm', 'video/mp4': 'mp4' }

// tiny stable hash for filenames (no Math.random — deterministic)
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36) }
const urlsInCss = v => [...String(v || '').matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map(m => m[2]).filter(u => !/^data:/.test(u))

// Collect every external asset URL a capture references, tagged by kind.
export function collectAssetUrls(cap) {
  const out = new Map()   // url → kind (first wins)
  const add = (u, kind) => { if (u && !/^data:/.test(u) && /^https?:\/\//.test(u) && !out.has(u)) out.set(u, kind) }
  for (const n of cap.nodes || []) {
    if (n.src) add(n.src, 'img')
    if (n.videoSrc) add(n.videoSrc, 'video')
    if (n.poster) add(n.poster, 'img')
    const s = n.style || {}
    if (s.bi) for (const u of urlsInCss(s.bi)) add(u, 'bg')
    for (const slot of ['before', 'after']) if (n[slot] && n[slot].style && n[slot].style.bi) for (const u of urlsInCss(n[slot].style.bi)) add(u, 'bg')
  }
  for (const face of cap.fontFaces || []) for (const u of urlsInCss(face)) add(u, 'font')
  return [...out.entries()].map(([url, kind]) => ({ url, kind }))
}

async function fetchAsset(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), PER_ASSET_MS)
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal })
    if (!res.ok) return null
    const ct = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    const buf = Buffer.from(await res.arrayBuffer())
    if (!buf.length || buf.length > MAX_BYTES) return null
    return { buf, ct }
  } catch { return null } finally { clearTimeout(t) }
}

// Download referenced assets into destDir; return Map(url → relative local path like "assets/xyz.png").
export async function downloadAssets(cap, destDir, opts = {}) {
  const max = opts.max || 160
  const items = collectAssetUrls(cap).slice(0, max)
  const assetsDir = path.join(destDir, 'assets')
  if (items.length) mkdirSync(assetsDir, { recursive: true })
  const map = new Map()
  let ok = 0, fail = 0, bytes = 0
  // bounded concurrency so a batch can't open hundreds of sockets at once
  const CONC = 8
  for (let i = 0; i < items.length; i += CONC) {
    const batch = items.slice(i, i + CONC)
    const got = await Promise.all(batch.map(it => fetchAsset(it.url)))
    got.forEach((g, j) => {
      const it = batch[j]
      if (!g) { fail++; return }
      const urlExt = (it.url.split('?')[0].match(/\.([a-z0-9]{2,5})$/i) || [])[1]
      const ext = EXT[g.ct] || (urlExt && urlExt.toLowerCase()) || 'bin'
      const rel = `assets/${hash(it.url)}.${ext}`
      writeFileSync(path.join(destDir, rel), g.buf)
      map.set(it.url, rel); ok++; bytes += g.buf.length
    })
  }
  return { map, stats: { requested: items.length, downloaded: ok, failed: fail, bytes } }
}

// Rewrite @font-face src url()s to local paths (returns new fontFaces array).
export function rewriteFontFaces(fontFaces, map, prefix = '/') {
  return (fontFaces || []).map(face => face.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, _q, u) => {
    const loc = map.get(u); return loc ? `url("${prefix}${loc}")` : m
  }))
}
// Rewrite a background-image value's url()s to local paths.
export function rewriteBg(value, map, prefix = '/') {
  return String(value || '').replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, _q, u) => {
    const loc = map.get(u); return loc ? `url("${prefix}${loc}")` : m
  })
}
// Map a single asset URL (img/video src) to its local path, or the original if not downloaded.
export const localSrc = (url, map, prefix = '/') => { const loc = map.get(url); return loc ? prefix + loc : url }

/* --------------------------------- CLI --------------------------------- */
const isMain = import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1] || '').href
if (isMain) {
  const argv = process.argv.slice(2)
  if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
    console.log(`\n  uiforge-assets — download a capture's external assets so the clone is self-contained.\n\n  node uiforge-assets.mjs capture.json --dest ./clone/public [--max 160]\n`)
    process.exit(0)
  }
  const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
  const dest = valAt('--dest') || './public'
  const max = +(valAt('--max') || 160)
  const valueIdx = new Set(); for (const nm of ['--dest', '--max']) { const i = argv.indexOf(nm); if (i >= 0) valueIdx.add(i + 1) }
  const capPath = argv.find((a, idx) => !a.startsWith('--') && !valueIdx.has(idx))
  const cap = JSON.parse(readFileSync(capPath, 'utf8'))
  const found = collectAssetUrls(cap)
  const byKind = found.reduce((m, a) => (m[a.kind] = (m[a.kind] || 0) + 1, m), {})
  const { map, stats } = await downloadAssets(cap, dest, { max })
  const B = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', C = '\x1b[36m', X = '\x1b[0m'
  console.log(`\n  ${B}UIForge assets${X} ${D}← ${capPath}${X}`)
  console.log(`    ${C}found${X}      ${found.length}  ${D}(${Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(' · ')})${X}`)
  console.log(`    ${C}downloaded${X} ${G}${stats.downloaded}${X}  ${D}${(stats.bytes / 1024 / 1024).toFixed(1)} MB → ${path.join(dest, 'assets')}${X}${stats.failed ? `  ${D}(${stats.failed} failed/skipped)${X}` : ''}\n`)
  if (valAt('--out-map')) writeFileSync(valAt('--out-map'), JSON.stringify([...map], null, 2))
}
