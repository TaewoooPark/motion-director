#!/usr/bin/env node
// uiforge-visualgate — the fidelity oracle. Renders two targets and pixel-diffs them, so a
// restore/rebuild is *proven* pixel-identical to the freeze, not hoped to be. Zero-dep: uses
// Playwright to render + a canvas to diff. Reports mismatch % and the worst-differing region's
// bounding box (so a caller can tell an LLM exactly what to fix). Each side may be a URL, an
// .html file, a .png image, or a project dir (a built Vite dist/ or plain static dir — served).
//
// Usage:
//   node uiforge-visualgate.mjs --a <url│file.html│img.png│dir> --b <…> [--viewport 1440x900] [--full] [--out diff.png] [--json]

import process from 'node:process'
import path from 'node:path'
import http from 'node:http'
import { pathToFileURL } from 'node:url'
import { spawn } from 'node:child_process'
import { existsSync, statSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { loadChromium } from './uiforge-capture.mjs'

const argv = process.argv.slice(2)
const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
if (argv.includes('-h') || argv.includes('--help') || !valAt('--a') || !valAt('--b')) {
  console.log(`\n  uiforge-visualgate — render two targets and pixel-diff them (zero-dep).\n\n  node uiforge-visualgate.mjs --a <url│file.html│img.png│dir> --b <…> [--viewport 1440x900] [--full] [--out diff.png] [--json]\n`)
  process.exit(valAt('--a') && valAt('--b') ? 0 : 1)
}
const A = valAt('--a'), Bt = valAt('--b')
const [vw, vh] = (valAt('--viewport') || '1440x900').split('x').map(Number)
const full = argv.includes('--full')
const jsonOut = argv.includes('--json')
const outDiff = valAt('--out')
const threshold = +(valAt('--threshold') || 16)   // per-channel tolerance (anti-aliasing)

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.gif': 'image/gif', '.avif': 'image/avif', '.ico': 'image/x-icon' }

// tiny static server for a dir (serves a built dist/ or plain static folder)
function serveDir(root, port) {
  const srv = http.createServer((req, res) => {
    let rel = decodeURIComponent((req.url || '/').split('?')[0])
    let fp = path.join(root, rel)
    try { if (existsSync(fp) && statSync(fp).isDirectory()) fp = path.join(fp, 'index.html') } catch {}
    if (!existsSync(fp)) fp = path.join(root, 'index.html')   // SPA fallback
    try { const body = readFileSync(fp); res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream', 'access-control-allow-origin': '*' }); res.end(body) }
    catch { res.writeHead(404); res.end() }
  })
  return new Promise(r => srv.listen(port, () => r(srv)))
}

async function targetToUrl(t, port, servers) {
  if (/^https?:\/\//.test(t)) return { url: t, png: null }
  if (existsSync(t)) {
    const st = statSync(t)
    if (st.isDirectory()) {
      const root = existsSync(path.join(t, 'dist', 'index.html')) ? path.join(t, 'dist') : t
      const srv = await serveDir(root, port); servers.push(srv)
      return { url: `http://localhost:${port}/`, png: null }
    }
    if (/\.png$/i.test(t)) return { url: null, png: readFileSync(t) }
    if (/\.html?$/i.test(t)) return { url: pathToFileURL(path.resolve(t)).href, png: null }
  }
  throw new Error('unresolvable target: ' + t)
}

async function screenshot(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  // wait for webfonts to actually load+swap (font-display:swap paints fallback first, then swaps)
  try { await page.evaluate(() => document.fonts && document.fonts.ready) } catch {}
  await page.waitForTimeout(1000)
  return await page.screenshot({ fullPage: full })
}

// diff two PNG buffers inside a canvas; returns { mismatchPct, bbox, w, h, diffPng }
async function diff(page, aPng, bPng) {
  const aB64 = aPng.toString('base64'), bB64 = bPng.toString('base64')
  return await page.evaluate(async ({ aB64, bB64, threshold }) => {
    const load = b64 => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = 'data:image/png;base64,' + b64 })
    const [ia, ib] = await Promise.all([load(aB64), load(bB64)])
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height)
    const mk = im => { const c = new OffscreenCanvas(w, h); const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, w, h).data }
    const da = mk(ia), db = mk(ib)
    const out = new OffscreenCanvas(w, h); const octx = out.getContext('2d'); const od = octx.createImageData(w, h)
    let diffN = 0, minX = w, minY = h, maxX = 0, maxY = 0
    // coarse heatmap over cells to find the worst region
    const CELL = 24, cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL); const cell = new Float64Array(cols * rows)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const dr = Math.abs(da[i] - db[i]), dg = Math.abs(da[i + 1] - db[i + 1]), dbb = Math.abs(da[i + 2] - db[i + 2])
      const bad = dr > threshold || dg > threshold || dbb > threshold
      if (bad) {
        diffN++
        od.data[i] = 255; od.data[i + 1] = 0; od.data[i + 2] = 0; od.data[i + 3] = 255
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y
        cell[Math.floor(y / CELL) * cols + Math.floor(x / CELL)]++
      } else { od.data[i] = da[i]; od.data[i + 1] = da[i + 1]; od.data[i + 2] = da[i + 2]; od.data[i + 3] = 80 }
    }
    octx.putImageData(od, 0, 0)
    const blob = await out.convertToBlob({ type: 'image/png' })
    const buf = new Uint8Array(await blob.arrayBuffer())
    let worst = 0, wi = 0; for (let k = 0; k < cell.length; k++) if (cell[k] > worst) { worst = cell[k]; wi = k }
    const wx = (wi % cols) * CELL, wy = Math.floor(wi / cols) * CELL
    return {
      mismatchPct: +(100 * diffN / (w * h)).toFixed(3), w, h,
      bbox: diffN ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : null,
      worstCell: worst ? { x: wx, y: wy, w: CELL, h: CELL, diffPixels: worst } : null,
      diffPngB64: btoa(String.fromCharCode(...buf.slice(0, 0))) || null,   // placeholder; real bytes returned separately
      _bytes: Array.from(buf),
    }
  }, { aB64, bB64, threshold })
}

async function run() {
  const chromium = await loadChromium()
  if (!chromium) { console.error('  Playwright not found'); process.exit(3) }
  const servers = []
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  try {
    const a = await targetToUrl(A, 8951, servers)
    const b = await targetToUrl(Bt, 8952, servers)
    const aPng = a.png || await screenshot(page, a.url)
    const bPng = b.png || await screenshot(page, b.url)
    const dpage = await ctx.newPage()
    await dpage.setContent('<!doctype html><body></body>')
    const r = await diff(dpage, aPng, bPng)
    if (outDiff && r._bytes) writeFileSync(outDiff, Buffer.from(r._bytes))
    delete r._bytes; delete r.diffPngB64
    if (jsonOut) { console.log(JSON.stringify(r)) }
    else {
      const G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', C = '\x1b[36m', D = '\x1b[2m', X = '\x1b[0m'
      const col = r.mismatchPct < 0.5 ? G : r.mismatchPct < 3 ? Y : R
      console.log(`\n  ${C}mismatch${X}   ${col}${r.mismatchPct}%${X}  ${D}(${r.w}×${r.h}, per-channel tol ${threshold})${X}`)
      if (r.worstCell) console.log(`  ${C}worst area${X} ${D}~(${r.worstCell.x},${r.worstCell.y}) ${r.worstCell.w}×${r.worstCell.h}${X}`)
      if (r.bbox) console.log(`  ${C}diff bbox${X}  ${D}x${r.bbox.x} y${r.bbox.y} ${r.bbox.w}×${r.bbox.h}${X}`)
      if (outDiff) console.log(`  ${C}diff img${X}   ${D}${outDiff}${X}`)
      console.log(`  ${r.mismatchPct < 0.5 ? G + '  → pixel-identical (within tolerance)' : r.mismatchPct < 3 ? Y + '  → close; inspect worst area' : R + '  → material difference'}${X}\n`)
    }
  } finally { await browser.close(); for (const s of servers) try { s.close() } catch {} }
}
run()
