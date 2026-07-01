#!/usr/bin/env node
// uiforge-score — grade any UI project A–F for slop. A review tool, not just a gate.
// Wraps uiforge-lint.mjs (--json) and prints a letter grade + the top tells.
// Zero dependencies. ESM.
//
// Usage:  node uiforge-score.mjs [dir] [--json]

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const JSON_OUT = args.includes('--json')
const dir = args.find(a => !a.startsWith('--')) || '.'

const r = spawnSync(process.execPath, [path.join(HERE, 'uiforge-lint.mjs'), dir, '--json'], { encoding: 'utf8' })
let data
try { data = JSON.parse(r.stdout) } catch { console.error('could not run linter:', r.stderr || r.stdout); process.exit(2) }

const { score, violations } = data
const blockers = violations.filter(v => v.sev === 'BLOCKER')
// grade: any blocker = shipped slop = F. Otherwise by accumulated warning score.
const grade =
  blockers.length ? 'F' :
  score === 0 ? 'A+' :
  score <= 10 ? 'A' :
  score <= 30 ? 'B' :
  score <= 60 ? 'C' :
  score <= 100 ? 'D' : 'F'
// 100 - normalized, floored at 0, for a friendly 0–100
const pct = Math.max(0, 100 - score - blockers.length * 15)

if (JSON_OUT) {
  console.log(JSON.stringify({ dir: data.root, grade, pct, score, blockers: blockers.length,
    tells: violations.map(v => ({ id: v.id, sev: v.sev, count: v.count })) }, null, 2))
  process.exit(blockers.length ? 1 : 0)
}

const R = '\x1b[31m', Y = '\x1b[33m', G = '\x1b[32m', B = '\x1b[1m', DIM = '\x1b[2m', X = '\x1b[0m'
const col = grade === 'F' ? R : (grade.startsWith('A') ? G : Y)
console.log(`\n  ${B}UIForge score:${X} ${col}${B}${grade}${X}  ${DIM}(${pct}/100 · lint score ${score} · ${blockers.length} blocker${blockers.length === 1 ? '' : 's'})${X}\n`)
if (!violations.length) console.log(`  ${G}no slop tells — ships as hand-crafted.${X}\n`)
else {
  for (const v of violations.sort((a, b) => (a.sev < b.sev ? -1 : 1)).slice(0, 10)) {
    const c = v.sev === 'BLOCKER' ? R : Y
    console.log(`  ${c}${v.sev === 'BLOCKER' ? '✗' : '⚠'}${X} ${v.id} ${DIM}×${v.count}${X}`)
  }
  console.log(`\n  ${DIM}Run  node uiforge-lint.mjs ${dir}  for details + line numbers.${X}\n`)
}
process.exit(blockers.length ? 1 : 0)
