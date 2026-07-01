#!/usr/bin/env node
// UIForge lint — makes slop a build failure, not a suggestion.
// Zero dependencies (Node standard library only). ESM.
//
// Usage:
//   node uiforge-lint.mjs [dir] [--json] [--strict] [--max-score N] [--quiet]
//   dir         project root to scan (default: cwd). Scans <dir>/src, <dir>/app, <dir>/index.html
//   --json      machine-readable output
//   --strict    also fail on accumulated warnings (max-score=0), not just BLOCKERs
//   --max-score fail if the weighted score exceeds N (overrides --strict)
//   --quiet     only print the verdict line
//
// Default gate: any BLOCKER fails; warnings are reported + scored but advisory.
// Exit code: 0 = pass, 1 = fail.

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const flags = new Set(args.filter(a => a.startsWith('--')))
const positional = args.filter(a => !a.startsWith('--'))
const ROOT = path.resolve(positional[0] || '.')
const JSON_OUT = flags.has('--json')
const QUIET = flags.has('--quiet')
const STRICT = flags.has('--strict') // also fail on accumulated warnings (score)
const MAX_SCORE = (() => {
  const i = args.indexOf('--max-score')
  if (i >= 0 && args[i + 1]) return Number(args[i + 1])
  return STRICT ? 0 : Infinity // default: BLOCKERs fail the gate; warnings are advisory
})()

const EXT = /\.(tsx|ts|jsx|js|css|html|mdx)$/
const SKIP = /node_modules|\.git|dist|build|\.next|coverage/

function walk(dir, out = []) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (SKIP.test(p)) continue
    if (e.isDirectory()) walk(p, out)
    else if (EXT.test(e.name)) out.push(p)
  }
  return out
}

// collect target files: src/, app/, and top-level index.html
const files = []
for (const sub of ['src', 'app']) walk(path.join(ROOT, sub), files)
for (const f of ['index.html']) {
  const p = path.join(ROOT, f)
  if (fs.existsSync(p)) files.push(p)
}

const read = f => { try { return fs.readFileSync(f, 'utf8') } catch { return '' } }
const texts = Object.fromEntries(files.map(f => [path.relative(ROOT, f), read(f)]))
const ALL = Object.values(texts).join('\n')
const codeText = Object.entries(texts)
  .filter(([k]) => /\.(tsx|ts|jsx|js)$/.test(k)).map(([, v]) => v).join('\n')

// severity weights
const W = { BLOCKER: 10, WARN: 2 }

// A rule: {id, sev, why, test(): {count, hits:[file:line]}}
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u
// default fonts, two ways: (a) inline font-family: …, and (b) a font STACK assigned
// to a const/var (e.g. `const SANS = '"Helvetica Neue", -apple-system, …, sans-serif'`).
const DEFAULT_FONT_INLINE = /(font-family|fontFamily)\s*[:=][^;\n}]*?(Inter|system-ui|-apple-system|BlinkMac|Segoe UI|Roboto|Helvetica|Arial|Open Sans|Lato)\b/i
const FONT_STACK_CONST = /\b(-apple-system|BlinkMacSystemFont|system-ui|Segoe UI|Inter|Roboto)\b[^\n]{0,140}(sans-serif|serif|monospace)/i
const HYPE = /\b(unlock|supercharge|elevate your|revolutioni[sz]e|streamline|seamless(ly)?|world[- ]?class|enterprise-grade|game[- ]?chang\w*|cutting[- ]edge|next[- ]generation|trusted by thousands|in today'?s fast-?paced world|effortless\w*)\b/i

function scan(re, opts = {}) {
  const hits = []
  let count = 0
  for (const [file, txt] of Object.entries(texts)) {
    if (opts.codeOnly && !/\.(tsx|ts|jsx|js)$/.test(file)) continue
    const lines = txt.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(re)
      if (m) { count++; if (hits.length < 5) hits.push(`${file}:${i + 1}`) }
    }
  }
  return { count, hits }
}

const RULES = [
  { id: 'default-font', sev: 'BLOCKER',
    why: 'Primary font is a default/system stack (Inter/system-ui/-apple-system/Roboto…), even when hidden in a const. Default fonts signal default thinking — pick a distinctive face.',
    run: () => {
      const a = scan(DEFAULT_FONT_INLINE), b = scan(FONT_STACK_CONST)
      return { count: a.count + b.count, hits: [...a.hits, ...b.hits].slice(0, 5) }
    } },
  { id: 'ai-purple', sev: 'BLOCKER',
    why: 'Indigo/violet/purple accent — the single most-cited AI tell. Commit to your own accent.',
    run: () => scan(/\b(bg|text|from|via|to|border|ring|fill|stroke)-(indigo|violet|purple|fuchsia)-\d{2,3}\b/) },
  { id: 'gradient-headline', sev: 'BLOCKER',
    why: 'Gradient headline text (bg-clip-text / text-transparent) — a template tell. Use a solid color.',
    run: () => scan(/bg-clip-text|text-transparent|-webkit-background-clip/) },
  { id: 'emoji-as-ui', sev: 'BLOCKER',
    why: 'Emoji used as icon/bullet/heading. Use a real icon set with text labels.',
    run: () => scan(new RegExp(`>\\s*${EMOJI.source}|${EMOJI.source}\\s*<|"\\s*${EMOJI.source}`, 'u'), { codeOnly: true }) },
  { id: 'hype-copy', sev: 'BLOCKER',
    why: 'Marketese lowers measured usability and is the copy signature of AI. Make every claim checkable.',
    run: () => scan(HYPE) },
  { id: 'raw-hex', sev: 'WARN',
    why: 'Raw hex/rgb at point of use — nothing traces to a token. Define semantic tokens and use var(--…).',
    run: () => scan(/(:|=|\(|\s)['"`]?#[0-9a-fA-F]{6}\b|rgba?\([^)]*\d/, { }) },
  { id: 'arbitrary-values', sev: 'WARN',
    why: 'Tailwind arbitrary values bypass the scale (p-[13px], text-[#…]). Snap to the token scale.',
    run: () => scan(/\b(p|m|gap|space|w|h|text|rounded|top|left|right|bottom|inset)[a-z]?-\[[^\]]+\]/, { codeOnly: true }) },
  { id: 'off-grid-space', sev: 'WARN',
    why: 'Off-8px-grid spacing (5/7/13/15px…) reads blurry and ad-hoc.',
    run: () => scan(/\b(padding|margin|gap|top|left|right|bottom)\s*:\s*(5|7|9|11|13|15|17|18|19|21|22|23|25|26|27)px|-\[(5|7|9|11|13|15|17|18|19|21|22|23)px\]/) },
  { id: 'maxed-radius+shadow', sev: 'WARN',
    why: 'The default AI card: rounded-2xl/3xl + shadow-lg/xl. Prefer borders + contrast; one radius vocabulary.',
    run: () => scan(/rounded-(2xl|3xl|full)[^"'`]*shadow-(lg|xl|2xl)|shadow-(lg|xl|2xl)[^"'`]*rounded-(2xl|3xl|full)/) },
  { id: 'gradient-overuse', sev: 'WARN',
    why: 'Many gradients. A gradient may exist only as a deliberate signature, not everywhere.',
    run: () => scan(/bg-gradient|from-\w+-\d|linear-gradient|radial-gradient|conic-gradient/) },
  { id: 'shadcn-default-neutral', sev: 'WARN',
    why: 'Unmodified slate/zinc — override the stock neutral so it is not the default shadcn look.',
    run: () => scan(/\b(bg|text|border|ring|from|to|via)-(slate|zinc)-\d{2,3}\b/) },
  { id: 'infinite-loop', sev: 'WARN',
    why: 'repeat: Infinity — an ambient loop is justified only when it encodes a real ongoing state.',
    run: () => scan(/repeat:\s*Infinity|animate-(spin|pulse|ping|bounce)\b/) },
]

// context rules (whole-project signals)
const usesMotion = /from\s+['"]motion|framer-motion|<motion\.|useAnimate|animate\(/.test(codeText)
const hasReducedMotion = /useReducedMotion|prefers-reduced-motion|reducedMotion/.test(ALL)
const hasTokens = /:root\s*\{[^}]*--[\w-]+\s*:/.test(ALL) || Object.keys(texts).some(k => /token|theme/i.test(k))

const results = RULES.map(r => ({ ...r, ...r.run() })).filter(r => r.count > 0)
if (usesMotion && !hasReducedMotion)
  results.push({ id: 'no-reduced-motion', sev: 'BLOCKER', count: 1, hits: [],
    why: 'Motion is used but there is no prefers-reduced-motion / useReducedMotion path. Reduced-motion is a design state, not optional.' })
if (!hasTokens)
  results.push({ id: 'no-design-tokens', sev: 'WARN', count: 1, hits: [],
    why: 'No design-token layer (:root custom properties / tokens file). Emit tokens first; derive everything from them.' })

const score = results.reduce((s, r) => s + W[r.sev] * (r.sev === 'BLOCKER' ? 1 : r.count), 0)
const blockers = results.filter(r => r.sev === 'BLOCKER')
const pass = blockers.length === 0 && score <= MAX_SCORE

if (JSON_OUT) {
  console.log(JSON.stringify({ root: ROOT, files: files.length, score, pass,
    violations: results.map(({ id, sev, count, why, hits }) => ({ id, sev, count, why, hits })) }, null, 2))
} else {
  const R = '\x1b[31m', Y = '\x1b[33m', G = '\x1b[32m', DIM = '\x1b[2m', X = '\x1b[0m'
  if (!QUIET) {
    console.log(`\n  UIForge lint — ${path.relative(process.cwd(), ROOT) || '.'}  (${files.length} files)\n`)
    if (!results.length) console.log(`  ${G}✓ no slop tells found${X}`)
    for (const r of results.sort((a, b) => (a.sev < b.sev ? -1 : 1))) {
      const c = r.sev === 'BLOCKER' ? R : Y
      console.log(`  ${c}${r.sev === 'BLOCKER' ? '✗' : '⚠'} ${r.id}${X} ${DIM}×${r.count}${X}`)
      console.log(`    ${DIM}${r.why}${X}`)
      if (r.hits.length) console.log(`    ${DIM}${r.hits.join('  ')}${r.count > r.hits.length ? '  …' : ''}${X}`)
    }
    console.log()
  }
  const verdict = pass ? `${G}✓ PASS${X}` : `${R}✗ FAIL${X}`
  const gate = MAX_SCORE === Infinity ? 'blockers-only' : `max-score=${MAX_SCORE}`
  console.log(`  ${verdict}  score=${score} blockers=${blockers.length} (gate: ${gate})\n`)
}

process.exit(pass ? 0 : 1)
