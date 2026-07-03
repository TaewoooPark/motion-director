#!/usr/bin/env node
// uiforge-diff — the fidelity gate (stage 5 of the clone pipeline).
//
// Render the reference and the reconstruction, and compute a visual diff. The old gate
// reported ONE number: the overall %% of full-page pixels that differ. That number is
// KIND — a matching background inflates it, and it averages away the one section where
// the clone actually collapsed. So the reconstruction can score "94%% similar" while the
// pricing grid is empty and the footer is gone.
//
// This version keeps that overall pixel %% (backward-compatible) but adds HONEST, LOCALIZED
// metrics so failure is pinpointed, not averaged:
//   • per-section similarity  — score each vertical band on its own (from segment.json, or
//                               8 equal bands). "hero 97%% · features 62%% · footer 88%%".
//   • structure               — reference-vs-output height ratio + coarse node-count ratio,
//                               flagging big collapses (output 40%% of ref height).
//   • element-presence        — sample ~30 visible text/image elements in the reference and
//                               check the output actually has each one, near the same place.
//   • ssim                    — a windowed structural-similarity score printed alongside the
//                               raw pixel %% as a deliberately less-flattering aggregate.
//
// Use it to prove the reconstruction is faithful (render it with the reference's OWN content,
// diff against the original) before swapping in the user's content.
//
// Usage:
//   node uiforge-diff.mjs <ref: url│file.html│png> <out: url│file.html│png>
//        [--segments segment.json] [--viewport 1440x900] [--heatmap diff.png] [--json]

import process from 'node:process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { readFileSync } from 'node:fs'
import { loadChromium } from './uiforge-capture.mjs'

const isImg = s => /\.(png|jpe?g|webp)$/i.test(s)

// Probe the rendered DOM (runs in the page). Returns the total node count, the true page
// height, and a list of visible text/image elements in ABSOLUTE page coordinates — the raw
// material for the structure + element-presence metrics. Images can't supply this, so an
// image target returns dom:null and those two metrics degrade to n/a.
function PROBE() {
  const vis = el => { const cs = getComputedStyle(el); return !(cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) }
  const directText = el => { let s = ''; for (const c of el.childNodes) if (c.nodeType === 3) s += c.textContent; return s.replace(/\s+/g, ' ').trim() }
  const sx = window.scrollX || 0, sy = window.scrollY || 0
  const de = document.documentElement, bd = document.body
  const pageH = Math.max(de.scrollHeight, bd ? bd.scrollHeight : 0, de.offsetHeight)
  const all = document.querySelectorAll('body *')
  const els = []
  for (const el of all) {
    if (els.length >= 900) break
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue   // one entry per <svg>, not its guts
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    const x = Math.round(r.left + sx), y = Math.round(r.top + sy)
    if (y > pageH + 300 || r.bottom + sy < -300) continue
    const tag = el.tagName.toLowerCase()
    if (tag === 'img' || tag === 'svg' || el.getAttribute('role') === 'img') {
      let t
      if (tag === 'img') { const s = el.currentSrc || el.getAttribute('src') || ''; t = ((s.split('?')[0].split('/').pop()) || el.getAttribute('alt') || 'img') }
      else t = el.getAttribute('aria-label') || 'svg'
      els.push({ kind: 'img', text: String(t).slice(0, 60).toLowerCase(), x, y, w: Math.round(r.width), h: Math.round(r.height) })
      continue
    }
    const dt = directText(el)
    if (dt.length >= 2) els.push({ kind: 'text', text: dt.slice(0, 80), x, y, w: Math.round(r.width), h: Math.round(r.height) })
  }
  return { width: window.innerWidth, height: pageH, nodeCount: all.length, elements: els }
}

// Render a target to a PNG data URL + (for HTML/URL) a DOM probe. Mirrors capture/freeze's
// settle (scroll top→bottom→top under reduced-motion so IntersectionObserver reveals fire
// and lazy media loads) so a LIVE reference isn't unfairly penalized for below-fold content
// that only appears on scroll — otherwise freeze/reconstruct look "wrong" where the live page
// simply hadn't revealed yet.
async function renderTarget(browser, target, viewport) {
  if (isImg(target)) {
    const ext = target.split('.').pop().toLowerCase().replace('jpg', 'jpeg')
    return { url: `data:image/${ext};base64,${readFileSync(target).toString('base64')}`, dom: null }
  }
  const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(path.resolve(target)).href
  const page = await browser.newPage({ viewport })
  await page.emulateMedia({ reducedMotion: 'reduce' }).catch(() => {})
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => page.goto(url, { timeout: 30000 }).catch(() => {}))
  await page.waitForTimeout(600)
  await page.evaluate(async () => {
    const step = Math.max(200, window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)) }
    window.scrollTo(0, 0)
  }).catch(() => {})
  await page.waitForTimeout(300)
  await page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if ((cs.position === 'fixed' || cs.position === 'sticky') && el.getBoundingClientRect().height > 140) el.remove() } document.documentElement.style.overflow = 'auto' }).catch(() => {})
  await page.waitForTimeout(200)
  let dom = null
  try { dom = await page.evaluate(`(${PROBE.toString()})()`) } catch {}
  const buf = await page.screenshot({ fullPage: true })
  await page.close()
  return { url: `data:image/png;base64,${buf.toString('base64')}`, dom }
}

// runs in the page: load both images, scale to a common width, then compute —
//   • overall per-pixel mismatch %% (unchanged: the KIND aggregate, kept for compatibility)
//   • per-cell delta grid (unchanged: the worst regions + heatmap)
//   • per-section similarity: each band scored on its OWN pixels, with a full-mismatch
//     penalty for reference rows the output is too short to cover (an honest collapse read).
//   • ssim: a windowed structural-similarity score over the overlap — a stricter aggregate.
// `sections` is [{name,y,h}] in reference-capture coordinates (px at `refW`), or null → 8 bands.
function COMPARE(aURL, bURL, cols, rows, thresh, wantHeat, sections, refW) {
  const load = src => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src })
  return Promise.all([load(aURL), load(bURL)]).then(([a, b]) => {
    if (!a || !b) return { error: 'image load failed' }
    const W = Math.min(a.naturalWidth, b.naturalWidth)
    const draw = im => { const s = W / im.naturalWidth, h = Math.round(im.naturalHeight * s); const cv = document.createElement('canvas'); cv.width = W; cv.height = h; cv.getContext('2d').drawImage(im, 0, 0, W, h); return { h, cx: cv.getContext('2d') } }
    const A = draw(a), B = draw(b), H = Math.min(A.h, B.h)
    const da = A.cx.getImageData(0, 0, W, H).data, db = B.cx.getImageData(0, 0, W, H).data
    let mismatch = 0; const total = W * H
    const cell = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0)), cn = Array.from({ length: rows }, () => Array(cols).fill(0))

    // ---- section bands in scaled-reference coordinates -------------------------------
    // Map capture px → scaled-image px by W/refW (refW defaults to the reference's own width,
    // which for a same-viewport render equals the capture width). Default = 8 equal bands.
    const scale = W / (refW || a.naturalWidth)
    const secDefs = (sections && sections.length)
      ? sections.map(s => ({ name: s.name, y0: Math.max(0, Math.round(s.y * scale)), y1: Math.min(A.h, Math.round((s.y + s.h) * scale)) }))
                .filter(s => s.y1 > s.y0)
      : Array.from({ length: 8 }, (_, k) => ({ name: 'band ' + (k + 1), y0: Math.round(k * H / 8), y1: Math.round((k + 1) * H / 8) }))
    const rowSec = new Int16Array(H).fill(-1)
    for (let i = 0; i < secDefs.length; i++) { const d = secDefs[i]; for (let y = Math.max(0, d.y0); y < Math.min(H, d.y1); y++) rowSec[y] = i }
    const secMis = new Float64Array(secDefs.length), secTot = new Float64Array(secDefs.length)

    // ---- main per-pixel pass: overall mismatch + grid + per-section overlap -----------
    for (let y = 0; y < H; y++) {
      const si = rowSec[y], rr = Math.min(rows - 1, Math.floor(y / H * rows))
      if (si >= 0) secTot[si] += W
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4
        const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])
        const over = d > thresh
        if (over) { mismatch++; if (si >= 0) secMis[si]++ }
        const cc = Math.min(cols - 1, Math.floor(x / W * cols))
        cell[rr][cc] += d; cn[rr][cc]++
      }
    }
    // Honest-collapse penalty: reference rows a too-short output can't cover count as full
    // mismatch for whichever section owns them (so a section the clone dropped scores ~0).
    for (let i = 0; i < secDefs.length; i++) {
      const extra = Math.max(0, Math.min(secDefs[i].y1, A.h) - H)
      if (extra > 0) { secTot[i] += extra * W; secMis[i] += extra * W }
    }
    const sectionScores = secDefs.map((d, i) => ({ name: d.name, sim: secTot[i] > 0 ? +(100 * (1 - secMis[i] / secTot[i])).toFixed(0) : null }))

    // ---- windowed SSIM over the overlap (grayscale, 8×8 windows) -----------------------
    let ssimSum = 0, ssimN = 0; const win = 8, C1 = 6.5025, C2 = 58.5225
    for (let by = 0; by < H; by += win) {
      const bh = Math.min(win, H - by)
      for (let bx = 0; bx < W; bx += win) {
        const bw = Math.min(win, W - bx)
        let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0, n = 0
        for (let yy = 0; yy < bh; yy++) { const base = ((by + yy) * W + bx) * 4
          for (let xx = 0; xx < bw; xx++) { const i = base + xx * 4
            const ga = da[i] * 0.299 + da[i + 1] * 0.587 + da[i + 2] * 0.114
            const gb = db[i] * 0.299 + db[i + 1] * 0.587 + db[i + 2] * 0.114
            sa += ga; sb += gb; saa += ga * ga; sbb += gb * gb; sab += ga * gb; n++ } }
        if (!n) continue
        const muA = sa / n, muB = sb / n, vA = saa / n - muA * muA, vB = sbb / n - muB * muB, cov = sab / n - muA * muB
        ssimSum += ((2 * muA * muB + C1) * (2 * cov + C2)) / ((muA * muA + muB * muB + C1) * (vA + vB + C2)); ssimN++
      }
    }
    const ssim = ssimN ? +(ssimSum / ssimN).toFixed(3) : null

    const cells = []
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ r, c, delta: +(cell[r][c] / cn[r][c] / 765).toFixed(3) })
    cells.sort((x, y) => y.delta - x.delta)
    let heat = null
    if (wantHeat) {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d')
      cx.drawImage(B.cx.canvas, 0, 0)
      for (const cd of cells) { const cw = W / cols, ch = H / rows; cx.fillStyle = `rgba(255,0,64,${Math.min(0.72, cd.delta * 2.2)})`; cx.fillRect(cd.c * cw, cd.r * ch, cw, ch) }
      heat = cv.toDataURL('image/png')
    }
    return { W, H, hA: A.h, hB: B.h, mismatchPct: +(100 * mismatch / total).toFixed(1), sections: sectionScores, ssim, worst: cells.slice(0, 8), heat }
  })
}

/* --------------------- element-presence (node side) --------------------- */
const normText = t => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim()
// Sample ~30 visible reference elements spread down the page, and check the output has a
// matching element (same text / same image, by substring) NEAR the same place. Reports the
// share present within a positional tolerance (moved/collapsed → fails) and, separately, the
// share found ANYWHERE (present but shifted vs. missing outright — a strictly kinder read).
function elementPresence(refDom, outDom, tol = 24, want = 30) {
  if (!refDom || !outDom || !refDom.elements || !outDom.elements) return null
  const refEls = refDom.elements.filter(e => e.kind === 'img' || normText(e.text).length >= 2)
  if (!refEls.length) return null
  refEls.sort((a, b) => a.y - b.y)
  const N = Math.min(want, refEls.length)
  const seen = new Set(), sample = []
  for (let k = 0; k < N; k++) { const idx = Math.round(k * (refEls.length - 1) / Math.max(1, N - 1)); if (!seen.has(idx)) { seen.add(idx); sample.push(refEls[idx]) } }
  const out = outDom.elements.map(e => ({ ...e, n: normText(e.text) }))
  let within = 0, found = 0
  for (const e of sample) {
    const en = normText(e.text); let best = Infinity, any = false
    for (const o of out) {
      if (e.kind === 'img') { if (o.kind !== 'img') continue }
      else if (o.kind !== 'text') continue
      const hit = o.n === en || (en.length >= 4 && o.n.length >= 4 && (o.n.includes(en) || en.includes(o.n)))
      if (!hit) continue
      any = true
      const d = Math.max(Math.abs(o.x - e.x), Math.abs(o.y - e.y))
      if (d < best) best = d
    }
    if (any) found++
    if (best <= tol) within++
  }
  return { sampled: sample.length, within, found, presentPct: Math.round(100 * within / sample.length), foundPct: Math.round(100 * found / sample.length), tol }
}

/* ------------------------------ structure ------------------------------ */
function structure(refDom, outDom, hA, hB) {
  const refHeight = refDom ? refDom.height : hA, outHeight = outDom ? outDom.height : hB
  const heightRatio = refHeight ? +(outHeight / refHeight).toFixed(2) : null
  const refNodes = refDom ? refDom.nodeCount : null, outNodes = outDom ? outDom.nodeCount : null
  const nodeRatio = (refNodes && outNodes) ? +(outNodes / refNodes).toFixed(2) : null
  const flags = []
  if (heightRatio != null && heightRatio < 0.6) flags.push(`height collapse — output is ${Math.round(heightRatio * 100)}% of reference`)
  else if (heightRatio != null && heightRatio > 1.6) flags.push(`height bloat — output is ${Math.round(heightRatio * 100)}% of reference`)
  if (nodeRatio != null && nodeRatio < 0.5) flags.push(`node collapse — output has ${Math.round(nodeRatio * 100)}% of reference nodes`)
  return { refHeight, outHeight, heightRatio, refNodes, outNodes, nodeRatio, flags, domBased: !!(refDom && outDom) }
}

/* --------------------------------- CLI --------------------------------- */
const argv = process.argv.slice(2)
if (argv.length < 2 || argv.includes('-h') || argv.includes('--help')) {
  console.log(`
  uiforge-diff — visual fidelity gate: how close is the reconstruction to the original?

  node uiforge-diff.mjs <ref: url│file.html│png> <out: url│file.html│png>
       [--segments segment.json] [--viewport 1440x900] [--heatmap diff.png] [--json]

  Reports an overall similarity %, a PER-SECTION table (from segment.json or 8 bands) so
  failure is localized not averaged, a structure read (height + node-count ratios), an
  element-presence check (~30 sampled reference elements found within ~24px), an SSIM
  aggregate, and the grid regions that differ most.
`)
  process.exit(0)
}
const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
const [vw, vh] = (valAt('--viewport') || '1440x900').split('x').map(Number)
const heatPath = valAt('--heatmap')
const segPath = valAt('--segments')
const valueIdx = new Set(); for (const nm of ['--viewport', '--heatmap', '--segments']) { const i = argv.indexOf(nm); if (i >= 0) valueIdx.add(i + 1) }
const [ref, out] = argv.filter((a, idx) => !a.startsWith('--') && !valueIdx.has(idx))

// optional segment.json → section bands (name + capture-space y/h) and the capture width.
let sections = null, refW = null
if (segPath) {
  try {
    const seg = JSON.parse(readFileSync(segPath, 'utf8'))
    sections = (seg.sections || []).map(s => ({ name: s.name, y: s.y, h: s.h })).filter(s => s.h > 0)
    refW = (seg.viewport && seg.viewport.w) || null
    if (!sections.length) { sections = null; console.error(`  (--segments had no sections; falling back to 8 bands)`) }
  } catch (e) { console.error(`  (could not read --segments ${segPath}: ${e.message}; falling back to 8 bands)`) }
}

const chromium = await loadChromium()
if (!chromium) { console.error('Playwright not found: npm i -D playwright && npx playwright install chromium'); process.exit(3) }
const browser = await chromium.launch()
const A = await renderTarget(browser, ref, { width: vw, height: vh })
const B = await renderTarget(browser, out, { width: vw, height: vh })
const page = await browser.newPage({ viewport: { width: vw, height: vh } })
const res = await page.evaluate(`(${COMPARE.toString()})(${JSON.stringify(A.url)}, ${JSON.stringify(B.url)}, 8, 14, 60, ${!!heatPath}, ${JSON.stringify(sections)}, ${JSON.stringify(refW)})`)
if (heatPath && res.heat) { const b64 = res.heat.split(',')[1]; (await import('node:fs')).writeFileSync(heatPath, Buffer.from(b64, 'base64')); delete res.heat }
await browser.close()
if (res.error) { console.error(res.error); process.exit(2) }

const similarity = +(100 - res.mismatchPct).toFixed(1)
const struct = structure(A.dom, B.dom, res.hA, res.hB)
const presence = elementPresence(A.dom, B.dom)

if (argv.includes('--json')) {
  console.log(JSON.stringify({
    ref, out, similarity, mismatchPct: res.mismatchPct, ssim: res.ssim, W: res.W, H: res.H,
    sections: res.sections, structure: struct, presence, worst: res.worst,
  }, null, 2))
  process.exit(0)
}

const B_ = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', Y = '\x1b[33m', R = '\x1b[31m', C = '\x1b[36m', X = '\x1b[0m'
const simCol = s => s == null ? D : s >= 90 ? G : s >= 75 ? Y : R
const col = similarity >= 92 ? G : similarity >= 78 ? Y : R
console.log(`\n  ${B_}UIForge diff${X}  ${col}${B_}${similarity}% similar${X} ${D}(${res.mismatchPct}% of pixels differ · ${res.W}×${res.H})${X}`)
console.log(`  ${D}reference height ${res.hA}px · reconstruction ${res.hB}px${X}`)

// structure
const hr = struct.heightRatio, nr = struct.nodeRatio
const hrCol = hr == null ? D : (hr < 0.6 || hr > 1.6) ? R : hr < 0.85 || hr > 1.25 ? Y : G
console.log(`\n  ${C}structure${X}   height ${D}ref${X} ${struct.refHeight}px ${D}· out${X} ${struct.outHeight}px ${D}·${X} ratio ${hrCol}${hr == null ? '—' : hr}${X}`)
if (nr != null) { const nrCol = nr < 0.5 ? R : nr < 0.8 || nr > 1.5 ? Y : G; console.log(`              nodes  ${D}ref${X} ${struct.refNodes} ${D}· out${X} ${struct.outNodes} ${D}·${X} ratio ${nrCol}${nr}${X}`) }
else console.log(`              nodes  ${D}n/a (one side is an image)${X}`)
for (const f of struct.flags) console.log(`              ${R}⚠ ${f}${X}`)

// element presence
if (presence) console.log(`\n  ${C}presence${X}    ${simCol(presence.presentPct)}${presence.presentPct}%${X} of ${presence.sampled} sampled elements present within ${presence.tol}px ${D}(${presence.foundPct}% found anywhere)${X}`)
else console.log(`\n  ${C}presence${X}    ${D}n/a (needs two rendered DOMs; an image target has none)${X}`)

// ssim
if (res.ssim != null) { const sCol = res.ssim >= 0.9 ? G : res.ssim >= 0.7 ? Y : R; console.log(`  ${C}ssim${X}        ${sCol}${res.ssim}${X} ${D}(windowed structural — the less-flattering aggregate vs the ${similarity}% pixel score)${X}`) }

// per-section table
const srcNote = sections ? `segment.json — ${res.sections.length} sections` : `8 equal bands (no --segments)`
console.log(`\n  ${C}per-section similarity${X} ${D}(${srcNote})${X}`)
const nameW = Math.min(18, Math.max(6, ...res.sections.map(s => s.name.length)))
for (const s of res.sections) {
  const bar = s.sim == null ? `${D}n/a${X}` : `${simCol(s.sim)}${'█'.repeat(Math.max(0, Math.round(s.sim / 5)))}${X}${D}${'░'.repeat(20 - Math.max(0, Math.round(s.sim / 5)))}${X}`
  console.log(`    ${s.name.padEnd(nameW)}  ${simCol(s.sim)}${s.sim == null ? ' n/a' : (String(s.sim) + '%').padStart(4)}${X}  ${bar}`)
}

// worst grid regions (unchanged)
console.log(`\n  ${C}regions that differ most${X} ${D}(row,col of an 8-col × 14-row grid → delta 0–1)${X}`)
for (const w of res.worst) console.log(`    r${w.r} c${w.c}  ${w.delta >= 0.15 ? R : Y}${'█'.repeat(Math.max(1, Math.round(w.delta * 20)))}${X} ${D}${w.delta}${X}`)
console.log()
