#!/usr/bin/env node
// uiforge-debundle — Tier C: when a site ships NO source maps, unpack its minified/bundled JS into
// a READABLE REFERENCE (not faithful source). Wraps webcrack (the one maintained tool that splits
// webpack bundles into modules AND turns modern _jsx/jsxs runtime calls back into JSX). Output is a
// study aid for the site's logic/handlers — component names, prop names and types are gone. For
// pixel-faithful editable output use Tier B (uiforge-restore); for real source use Tier A
// (uiforge-sourcemap). Behavior itself is the Archive's job (replay).
//
// Usage:
//   node uiforge-debundle.mjs <archiveDir> --out-dir ./debundled [--max 6] [--min-kb 40]

import process from 'node:process'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs'

const argv = process.argv.slice(2)
if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
  console.log(`\n  uiforge-debundle — unpack minified JS into a readable reference (Tier C, needs webcrack via npx).\n\n  node uiforge-debundle.mjs <archiveDir> --out-dir ./debundled [--max 6] [--min-kb 40]\n`)
  process.exit(argv.length ? 0 : 1)
}
const valAt = n => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : null }
const outDir = valAt('--out-dir') || './debundled'
const maxBundles = +(valAt('--max') || 6)
const minKb = +(valAt('--min-kb') || 40)
const valueIdx = new Set(); for (const nm of ['--out-dir', '--max', '--min-kb']) { const i = argv.indexOf(nm); if (i >= 0) valueIdx.add(i + 1) }
const archive = argv.find((a, idx) => !a.startsWith('--') && !valueIdx.has(idx))
if (!archive || !existsSync(path.join(archive, 'index.json'))) { console.error('  need an archive dir (with index.json)'); process.exit(1) }

const B = '\x1b[1m', D = '\x1b[2m', G = '\x1b[32m', C = '\x1b[36m', Y = '\x1b[33m', X = '\x1b[0m'

function haveWebcrack() {
  const r = spawnSync('npx', ['--no-install', 'webcrack', '--version'], { encoding: 'utf8' })
  return r.status === 0
}

function run() {
  console.log(`\n  ${B}UIForge debundle${X} ${D}← ${archive}${X}`)
  const idx = JSON.parse(readFileSync(path.join(archive, 'index.json'), 'utf8'))
  const fdir = existsSync(path.join(archive, 'files')) ? 'files' : 'data'
  // pick the largest JS bundles (the app chunks carry the logic)
  const bundles = (idx.entries || [])
    .filter(e => /javascript|ecmascript/.test(e.ct || '') && e.file)
    .map(e => { const abs = path.join(archive, fdir, e.file); let size = 0; try { size = statSync(abs).size } catch {} return { abs, url: e.url, size } })
    .filter(b => b.size >= minKb * 1024)
    .sort((a, b) => b.size - a.size)
    .slice(0, maxBundles)

  if (!bundles.length) { console.log(`    ${Y}no JS bundles ≥ ${minKb}KB found${X}\n`); process.exit(0) }

  // webcrack availability: prefer already-installed; else fetch via npx (one-time)
  let cmdBase = ['--no-install', 'webcrack']
  if (!haveWebcrack()) {
    console.log(`    ${D}webcrack not installed — fetching via npx (one-time)…${X}`)
    cmdBase = ['--yes', 'webcrack@latest']
  }

  mkdirSync(outDir, { recursive: true })
  let ok = 0
  for (const b of bundles) {
    const name = (() => { try { return path.basename(new URL(b.url).pathname) || 'bundle.js' } catch { return 'bundle.js' } })()
    const dest = path.join(outDir, name.replace(/\.js$/, ''))
    process.stdout.write(`    ${C}unpack${X}   ${D}${name} (${Math.round(b.size / 1024)}KB)…${X} `)
    const r = spawnSync('npx', [...cmdBase, b.abs, '-o', dest], { encoding: 'utf8', timeout: 180000 })
    if (r.status === 0) { console.log(`${G}→ ${path.relative(process.cwd(), dest)}/${X}`); ok++ }
    else { console.log(`${Y}failed${X} ${D}${(r.stderr || r.error?.message || '').slice(0, 80)}${X}`) }
  }
  console.log(`\n    ${ok ? G + ok + ' bundle(s) unpacked' + X : Y + 'nothing unpacked' + X} → ${G}${outDir}/${X}`)
  console.log(`    ${D}⚠ readable REFERENCE only (names/types erased). Real source → Tier A (sourcemap); pixel-faithful editable → Tier B (restore).${X}\n`)
}
run()
