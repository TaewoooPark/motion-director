#!/usr/bin/env node
// create-uiforge — wire a project so slop can't land: drop in a token kit,
// the linter, an npm script, a pre-commit hook, and a CI workflow.
// Zero dependencies (Node standard library only). ESM.
//
// Usage:
//   node create-uiforge.mjs <direction> [target-dir] [--force] [--no-hook]
//   direction: editorial | precise | brutalist | warm | maximalist
//
// It does NOT scaffold the app (use `npm create vite@latest` first); it wires
// UIForge into an existing project.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const KITS = ['editorial', 'precise', 'brutalist', 'warm', 'maximalist']
const args = process.argv.slice(2)
const flags = new Set(args.filter(a => a.startsWith('--')))
const [direction, targetArg] = args.filter(a => !a.startsWith('--'))
const TARGET = path.resolve(targetArg || '.')

const die = m => { console.error(`✗ ${m}`); process.exit(1) }
if (!direction || !KITS.includes(direction))
  die(`pick a direction: ${KITS.join(' | ')}\n  node create-uiforge.mjs <direction> [target-dir]`)

const pkgPath = path.join(TARGET, 'package.json')
if (!fs.existsSync(pkgPath))
  die(`no package.json in ${TARGET}. Scaffold the app first (e.g. npm create vite@latest), then re-run here.`)

const log = m => console.log(`  ${m}`)
console.log(`\n  create-uiforge — wiring ${path.relative(process.cwd(), TARGET) || '.'} for the "${direction}" direction\n`)

// 1) token kit → src/index.css (or a side file if one exists and no --force)
const srcDir = fs.existsSync(path.join(TARGET, 'app')) ? path.join(TARGET, 'app') : path.join(TARGET, 'src')
fs.mkdirSync(srcDir, { recursive: true })
const kit = fs.readFileSync(path.join(HERE, 'kits', `${direction}.css`), 'utf8')
const cssTarget = path.join(srcDir, 'index.css')
if (!fs.existsSync(cssTarget) || flags.has('--force')) {
  fs.writeFileSync(cssTarget, kit); log(`✓ wrote token kit → ${path.relative(TARGET, cssTarget)}`)
} else {
  const side = path.join(srcDir, 'uiforge-tokens.css')
  fs.writeFileSync(side, kit)
  log(`• ${path.relative(TARGET, cssTarget)} exists — wrote ${path.relative(TARGET, side)}; add \`@import './uiforge-tokens.css';\` at its top`)
}

// 2) linter → scripts/uiforge-lint.mjs (self-contained copy)
const scriptsDir = path.join(TARGET, 'scripts'); fs.mkdirSync(scriptsDir, { recursive: true })
fs.copyFileSync(path.join(HERE, 'uiforge-lint.mjs'), path.join(scriptsDir, 'uiforge-lint.mjs'))
log(`✓ copied linter → scripts/uiforge-lint.mjs`)

// 3) npm script
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
pkg.scripts = pkg.scripts || {}
pkg.scripts['lint:ui'] = 'node scripts/uiforge-lint.mjs . --strict'
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
log(`✓ added npm script  "lint:ui": "node scripts/uiforge-lint.mjs . --strict"`)

// 4) pre-commit hook (if a git repo, and not --no-hook)
const gitDir = path.join(TARGET, '.git')
if (fs.existsSync(gitDir) && !flags.has('--no-hook')) {
  const hookDir = path.join(gitDir, 'hooks'); fs.mkdirSync(hookDir, { recursive: true })
  const hook = path.join(hookDir, 'pre-commit')
  fs.writeFileSync(hook, `#!/bin/sh\n# UIForge gate — block slop from landing\nnode scripts/uiforge-lint.mjs . --strict || {\n  echo "\\nUIForge: fix the slop above, or commit with --no-verify to override.";\n  exit 1;\n}\n`)
  fs.chmodSync(hook, 0o755)
  log(`✓ installed pre-commit hook (.git/hooks/pre-commit)`)
}

// 5) CI workflow
const wfDir = path.join(TARGET, '.github', 'workflows'); fs.mkdirSync(wfDir, { recursive: true })
fs.writeFileSync(path.join(wfDir, 'uiforge.yml'),
`name: UIForge gate
on: [pull_request]
jobs:
  uiforge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node scripts/uiforge-lint.mjs . --strict
`)
log(`✓ wrote CI workflow (.github/workflows/uiforge.yml)`)

// 6) fonts + next steps
const fontLine = (kit.match(/npm i @fontsource[^\n]*/) || ['(see the kit header for the font install line)'])[0]
console.log(`\n  Next:`)
console.log(`    1. install the kit's fonts:  ${fontLine}`)
console.log(`       and @import them at the top of ${path.relative(TARGET, cssTarget)}`)
console.log(`    2. build with the tokens (bg-bg, text-fg, bg-primary …), never raw hex`)
console.log(`    3. gate it:  npm run lint:ui\n`)
