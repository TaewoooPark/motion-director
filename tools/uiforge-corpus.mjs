#!/usr/bin/env node
// uiforge-corpus — empirical validation. Run the render-audit (+ attention) over a
// LABELED corpus (designed vs template) and report whether the grades actually
// separate the classes. This is the honest replacement for a manufactured "+X% CTR"
// stat: a measurement anyone can reproduce and check — including its failures.
//
// Usage:
//   node uiforge-corpus.mjs [corpus.json] [--json] [--out results.json] [--viewport WxH]
//
// corpus.json = [ { "ref": "<url|file.html>", "label": "designed"|"template", "note": "..." }, ... ]
// Default corpus: tools/corpus/corpus.json.
//
// Honest by construction: external sites can 429 / cookie-wall / time out — those are
// recorded as `failed`, not silently dropped, and excluded from the class means.

import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  console.log(`
  uiforge-corpus — does the grade separate designed from template?

  node uiforge-corpus.mjs [corpus.json] [--json] [--out results.json] [--viewport WxH]

  corpus.json: [ { ref, label: "designed"|"template", note? } ]
  Runs render-audit + attention on each, aggregates by label, reports separation.
  Failures (429 / timeout / cookie-wall) are recorded, not dropped.
`)
  process.exit(0)
}
const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
const JSON_OUT = argv.includes('--json')
const outPath = valAt('--out')
const viewport = valAt('--viewport') || '1440x900'
const valueIdx = new Set(); for (const nm of ['--out', '--viewport']) { const i = argv.indexOf(nm); if (i >= 0) valueIdx.add(i + 1) }
const corpusPath = argv.find((a, idx) => !a.startsWith('--') && !valueIdx.has(idx)) || path.join(HERE, 'corpus', 'corpus.json')

if (!existsSync(corpusPath)) { console.error(`no corpus at ${corpusPath}`); process.exit(2) }
const corpus = JSON.parse(readFileSync(corpusPath, 'utf8'))

const resolveRef = ref => /^https?:/.test(ref) ? ref : (path.isAbsolute(ref) ? ref : path.resolve(path.dirname(corpusPath), ref))
const runJSON = (tool, ref) => {
  const r = spawnSync('node', [path.join(HERE, tool), resolveRef(ref), '--viewport', viewport, '--json'],
    { encoding: 'utf8', env: process.env, timeout: 45000 })
  try { return JSON.parse(r.stdout) } catch { return null }
}

const results = []
for (const item of corpus) {
  const audit = runJSON('uiforge-render-audit.mjs', item.ref)
  if (!audit) { results.push({ ...item, status: 'failed', reason: 'render/audit produced no result (429 / timeout / block?)' }); continue }
  const att = runJSON('uiforge-attention.mjs', item.ref)
  results.push({
    ref: item.ref, label: item.label, note: item.note || '', status: 'ok',
    grade: audit.grade, pct: audit.pct, contrastFails: audit.metrics?.contrastFails ?? null,
    accentPct: audit.metrics?.accentPct ?? null, hierarchy: att?.verdict?.status ?? 'n/a',
  })
}

const ok = results.filter(r => r.status === 'ok')
const byLabel = label => ok.filter(r => r.label === label)
const mean = xs => xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : null
const stats = label => {
  const rows = byLabel(label), pcts = rows.map(r => r.pct)
  return { label, n: rows.length, meanPct: mean(pcts), min: pcts.length ? Math.min(...pcts) : null, max: pcts.length ? Math.max(...pcts) : null,
    meanContrastFails: mean(rows.map(r => r.contrastFails)), flatPct: rows.length ? Math.round(100 * rows.filter(r => r.hierarchy === 'flat').length / rows.length) : null }
}
const designed = stats('designed'), template = stats('template')
const separation = designed.meanPct != null && template.meanPct != null ? +(designed.meanPct - template.meanPct).toFixed(1) : null
const failed = results.filter(r => r.status === 'failed')
const summary = { viewport, n: corpus.length, ran: ok.length, failed: failed.length, designed, template, separation }

if (outPath) writeFileSync(outPath, JSON.stringify({ summary, results }, null, 2) + '\n')
if (JSON_OUT) { console.log(JSON.stringify({ summary, results }, null, 2)); process.exit(0) }

const B = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m'
console.log(`\n  ${B}UIForge corpus${X} ${D}— ${ok.length}/${corpus.length} ran @ ${viewport}${failed.length ? ` · ${failed.length} failed` : ''}${X}\n`)
for (const r of results.sort((a, b) => (a.label || '').localeCompare(b.label || '') || (b.pct || 0) - (a.pct || 0))) {
  if (r.status === 'failed') { console.log(`  ${R}✗${X} ${D}${r.label?.padEnd(9)}${X} ${r.ref} ${D}— ${r.reason}${X}`); continue }
  const c = r.pct >= 80 ? G : r.pct >= 60 ? Y : R
  console.log(`  ${c}${String(r.grade).padEnd(2)}${X} ${D}${r.label.padEnd(9)}${X} ${c}${String(r.pct).padStart(3)}${X} ${D}· contrast ${r.contrastFails} · ${r.hierarchy}${X}  ${r.ref}`)
}
console.log(`\n  ${B}designed${X}  n=${designed.n}  mean ${G}${designed.meanPct}${X}  (${designed.min}–${designed.max})  flat ${designed.flatPct}%`)
console.log(`  ${B}template${X}  n=${template.n}  mean ${R}${template.meanPct}${X}  (${template.min}–${template.max})  flat ${template.flatPct}%`)
if (separation != null) console.log(`\n  ${separation >= 15 ? G : Y}${B}separation: ${separation > 0 ? '+' : ''}${separation} pts${X} ${D}(designed − template mean)${X}`)
console.log()
process.exit(0)
