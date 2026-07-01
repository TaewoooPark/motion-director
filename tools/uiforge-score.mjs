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

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  uiforge-score — grade a UI project A–F for slop.

  Usage:  node uiforge-score.mjs [dir] [--json]
    dir      project root to grade (default: current directory)
    --json   machine-readable output

  Wraps uiforge-lint.mjs. A blocker (a visible AI tell) is heavy and caps a
  single-blocker UI at C; warning-level tells lower it from there. 0 tells → A+.
`)
  process.exit(0)
}

const dir = args.find(a => !a.startsWith('--')) || '.'

const r = spawnSync(process.execPath, [path.join(HERE, 'uiforge-lint.mjs'), dir, '--json'], { encoding: 'utf8' })
let data
try { data = JSON.parse(r.stdout) } catch { console.error('could not run linter:', r.stderr || r.stdout); process.exit(2) }

const R = '\x1b[31m', Y = '\x1b[33m', G = '\x1b[32m', B = '\x1b[1m', DIM = '\x1b[2m', X = '\x1b[0m'

// Nothing scanned → refuse to fabricate a grade (the audit's false-A+ trap: an
// empty/non-standard repo used to score A+ for a UI that does not exist).
if (data.empty || data.files === 0) {
  if (JSON_OUT) console.log(JSON.stringify({ dir: data.root, grade: 'N/A', pct: null, files: 0,
    note: 'no UI files scanned — nothing to grade' }, null, 2))
  else console.log(`\n  ${B}UIForge score:${X} ${Y}N/A${X}  ${DIM}— no UI files found under src/app/components/pages/ui/styles or index.html.\n  Point it at your UI root:  node uiforge-score.mjs <dir>.${X}\n`)
  process.exit(0)
}

const { score, violations } = data
const blockers = violations.filter(v => v.sev === 'BLOCKER')
const warns = violations.filter(v => v.sev === 'WARN')

// One coherent 0–100 scale, and a letter derived FROM it — so grade and pct can
// never disagree. A blocker is a visible "a machine made this" tell: heavy
// (−22 each), which caps a single-blocker UI at C. Warning tells are light
// (−2 each). 0 tells → 100 → A+.
const warnCount = warns.reduce((s, v) => s + v.count, 0)
const pct = Math.max(0, 100 - blockers.length * 22 - warnCount * 2)
const grade =
  pct >= 97 ? 'A+' :
  pct >= 90 ? 'A'  :
  pct >= 80 ? 'B'  :
  pct >= 70 ? 'C'  :
  pct >= 60 ? 'D'  : 'F'

if (JSON_OUT) {
  console.log(JSON.stringify({ dir: data.root, grade, pct, blockers: blockers.length, lintScore: score,
    tells: violations.map(v => ({ id: v.id, sev: v.sev, count: v.count })) }, null, 2))
  process.exit(blockers.length ? 1 : 0)
}

const col = grade === 'F' ? R : (grade.startsWith('A') ? G : Y)
console.log(`\n  ${B}UIForge score:${X} ${col}${B}${grade}${X}  ${DIM}(${pct}/100 · ${blockers.length} blocker${blockers.length === 1 ? '' : 's'} · ${warnCount} warning tell${warnCount === 1 ? '' : 's'})${X}\n`)
if (!violations.length) console.log(`  ${G}no slop tells — ships as hand-crafted.${X}\n`)
else {
  for (const v of violations.sort((a, b) => (a.sev < b.sev ? -1 : 1)).slice(0, 10)) {
    const c = v.sev === 'BLOCKER' ? R : Y
    console.log(`  ${c}${v.sev === 'BLOCKER' ? '✗' : '⚠'}${X} ${v.id} ${DIM}×${v.count}${X}`)
  }
  console.log(`\n  ${DIM}Run  node uiforge-lint.mjs ${dir}  for details + line numbers.${X}\n`)
}
process.exit(blockers.length ? 1 : 0)
