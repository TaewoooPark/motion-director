#!/usr/bin/env node
// @ts-check
/**
 * UIForge harvester (M1b) — pulls shadcn-compatible registry components into a
 * SQLite catalog with a per-item static signature parsed from source.
 *
 * SOURCE stage backing store. Later (M2) a spec (radius/color/spacing/density)
 * is matched against each item's static signature to rank install candidates.
 *
 * Storage: Node's built-in `node:sqlite` (DatabaseSync). No external deps.
 *   Node prints an ExperimentalWarning for node:sqlite; run with --no-warnings
 *   (the npm scripts below add it) or ignore it — the API we use is stable.
 *
 * Registry-agnostic: add entries to REGISTRIES to harvest more registries later.
 * Only @shadcn is fully wired now. @motion-primitives etc. rate-limit CI (429),
 * so they are intentionally left out of the default run.
 *
 * Usage:
 *   node --no-warnings tools/uiforge-harvest.mjs               # harvest all registries in REGISTRIES
 *   node --no-warnings tools/uiforge-harvest.mjs --registry @shadcn
 *   node --no-warnings tools/uiforge-harvest.mjs --limit 20    # first N items (smoke test)
 *   node --no-warnings tools/uiforge-harvest.mjs --concurrency 12
 *   node --no-warnings tools/uiforge-harvest.mjs --db path/to.db
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = join(__dirname, 'catalog');
const DEFAULT_DB = join(CATALOG_DIR, 'catalog.db');

/**
 * Registry config. Each registry knows:
 *  - name: the @-prefixed namespace used as the id prefix (`@shadcn/button`)
 *  - itemUrl(name): where to fetch a single item's registry-item JSON
 *  - itemsFile: optional path to a JSON file listing {name,type} to harvest
 *      (so a run is reproducible without the MCP). If absent we cannot enumerate.
 *
 * To add a registry later, push another object here. The rest is generic.
 */
const REGISTRIES = [
  {
    name: '@shadcn',
    itemUrl: (n) => `https://ui.shadcn.com/r/styles/new-york/${n}.json`,
    itemsFile: join(CATALOG_DIR, 'shadcn-items.json'),
  },
  // Example of how a future registry would be added (NOT harvested by default —
  // motion-primitives rate-limits CI fetches with 429):
  // {
  //   name: '@motion-primitives',
  //   itemUrl: (n) => `https://motion-primitives.com/c/${n}.json`,
  //   itemsFile: join(CATALOG_DIR, 'motion-primitives-items.json'),
  // },
];

// ---------------------------------------------------------------------------
// Static signature parser — all cheap regex over concatenated file `content`.
// No rendering. Returns a JSON-serialisable object.
// ---------------------------------------------------------------------------

/** Semantic color roles in the shadcn/Tailwind token system we look for. */
const SEMANTIC_ROLES = [
  'background', 'foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'border', 'input', 'ring',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-accent',
  'sidebar-border', 'sidebar-ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
];

/** Utility prefixes that can carry a semantic color role. */
const COLOR_UTIL_PREFIXES = [
  'bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'via', 'to',
  'outline', 'divide', 'shadow', 'accent', 'caret', 'decoration',
  'ring-offset', 'placeholder',
];

/**
 * Parse a static signature from the concatenated component source.
 * @param {string} src
 * @param {{dependencies?: Record<string,string>|string[], registryDependencies?: string[]}} meta
 */
function parseStaticSignature(src, meta = {}) {
  const text = src || '';

  // --- radii: rounded-* utilities + arbitrary rounded-[..] values ---
  const radii = new Set();
  // named: rounded, rounded-sm, rounded-md, rounded-t-lg, rounded-full, etc.
  for (const m of text.matchAll(/\brounded(?:-(?:t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?(?:-(none|sm|md|lg|xl|2xl|3xl|full))?\b/g)) {
    radii.add(m[1] ? m[1] : 'DEFAULT');
  }
  // arbitrary: rounded-[10px], rounded-t-[--radius], etc.
  for (const m of text.matchAll(/\brounded(?:-(?:t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?-\[([^\]]+)\]/g)) {
    radii.add(`[${m[1]}]`);
  }

  // --- variants: cva( / class-variance-authority ---
  const usesCva = /class-variance-authority/.test(text) || /\bcva\s*\(/.test(text);
  let variantAxes = 0;
  if (usesCva) {
    // Count keys inside a `variants: { ... }` block (best-effort, first block).
    const vm = text.match(/variants\s*:\s*\{/);
    if (vm) {
      const start = vm.index + vm[0].length - 1; // at the '{'
      let depth = 0, i = start, end = -1;
      for (; i < text.length; i++) {
        const c = text[i];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end > start) {
        const block = text.slice(start + 1, end);
        // top-level keys of the variants object = axes (e.g. variant, size)
        let d = 0;
        const keys = new Set();
        const keyRe = /(^|[,{])\s*([A-Za-z_$][\w$]*)\s*:/g;
        // walk char-by-char to only capture depth-0 keys
        let buf = '';
        d = 0;
        for (let j = 0; j < block.length; j++) {
          const c = block[j];
          if (c === '{' || c === '[' || c === '(') d++;
          else if (c === '}' || c === ']' || c === ')') d--;
          if (d === 0 && c === ':') {
            const km = buf.match(/([A-Za-z_$][\w$]*)\s*$/);
            if (km) keys.add(km[1]);
            buf = '';
          } else if (d === 0 && (c === ',' )) {
            buf = '';
          } else {
            buf += c;
          }
        }
        variantAxes = keys.size;
      }
    }
  }

  // --- colorTokens: distinct semantic roles referenced via color utilities ---
  const colorTokens = new Set();
  for (const role of SEMANTIC_ROLES) {
    // match `<prefix>-<role>` as a class fragment, optional /opacity
    const re = new RegExp(
      `\\b(?:${COLOR_UTIL_PREFIXES.join('|')})-${role.replace(/[-]/g, '\\-')}(?:\\/\\d+)?\\b`
    );
    if (re.test(text)) colorTokens.add(role);
  }
  // also catch bare CSS var references like var(--primary) / hsl(var(--border))
  for (const m of text.matchAll(/var\(--([a-z0-9-]+)\)/g)) {
    if (SEMANTIC_ROLES.includes(m[1])) colorTokens.add(m[1]);
  }

  // --- usesRawColor: raw hex, rgb()/hsl() literals, or bg-[#..] arbitrary ---
  const usesRawColor =
    /#[0-9a-fA-F]{3,8}\b/.test(text) ||
    /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline)-\[(?:#|rgb|hsl|rgba|hsla)/i.test(text) ||
    /\b(?:rgb|rgba|hsl|hsla)\(\s*\d/.test(text);

  // --- spacingScale: distinct numeric steps on p/px/py/pt../m../gap/space ---
  const spacing = new Set();
  const spacingRe =
    /\b(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?|px)\b/g;
  for (const m of text.matchAll(spacingRe)) spacing.add(m[1]);

  // --- a11y booleans ---
  const a11y = {
    hasFocusVisible: /\bfocus-visible:/.test(text),
    hasAria: /\baria-[a-z]+\b/.test(text) || /\baria-[A-Za-z]+=/.test(text),
    hasRole: /\brole=/.test(text) || /\brole:\s*['"]/.test(text),
    hasSrOnly: /\bsr-only\b/.test(text),
  };

  // --- motion ---
  const motion =
    /\btransition(?:-[a-z]+)?\b/.test(text) ||
    /\banimate-[a-z0-9-]+\b/.test(text) ||
    /\bdata-\[state[^\]]*\]:/.test(text) ||
    /\bduration-\d+\b/.test(text);

  // --- depsRadix ---
  const depList = normalizeDeps(meta.dependencies);
  const regDeps = meta.registryDependencies || [];
  const depsRadix =
    depList.some((d) => /@?radix-ui/.test(d)) ||
    /@radix-ui\//.test(text) ||
    /["']radix-ui["']/.test(text);

  return {
    radii: [...radii].sort(),
    hasVariants: usesCva,
    variantAxes,
    colorTokens: [...colorTokens].sort(),
    usesRawColor,
    spacingScale: [...spacing].sort(sortSpacing),
    a11y,
    motion,
    depsRadix,
  };
}

/** dependencies can be an object map or an array; return a name array. */
function normalizeDeps(deps) {
  if (!deps) return [];
  if (Array.isArray(deps)) return deps;
  if (typeof deps === 'object') return Object.keys(deps);
  return [];
}

/** numeric-ish spacing sort ('px' first, then numbers). */
function sortSpacing(a, b) {
  if (a === 'px') return -1;
  if (b === 'px') return 1;
  return parseFloat(a) - parseFloat(b);
}

/** Derive coarse search tags from name/type/signature. */
function deriveTags(name, type, sig) {
  const tags = new Set();
  for (const part of name.split('-')) if (part) tags.add(part.toLowerCase());
  tags.add(type);
  if (sig.depsRadix) tags.add('radix');
  if (sig.hasVariants) tags.add('variants');
  if (sig.motion) tags.add('motion');
  if (sig.a11y.hasFocusVisible || sig.a11y.hasAria || sig.a11y.hasRole || sig.a11y.hasSrOnly)
    tags.add('a11y');
  if (sig.usesRawColor) tags.add('rawcolor');
  for (const role of sig.colorTokens) tags.add(role);
  return [...tags];
}

// ---------------------------------------------------------------------------
// DB schema
// ---------------------------------------------------------------------------

/** @param {DatabaseSync} db */
function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id            TEXT PRIMARY KEY,   -- "@shadcn/button"
      registry      TEXT NOT NULL,      -- "@shadcn"
      name          TEXT NOT NULL,      -- "button"
      type          TEXT NOT NULL,      -- "ui" | "block" | "example" | ...
      deps          TEXT NOT NULL,      -- JSON array of npm deps
      reg_deps      TEXT NOT NULL,      -- JSON array of registry deps
      file_count    INTEGER NOT NULL,
      files         TEXT NOT NULL,      -- JSON array of file paths
      signature     TEXT NOT NULL,      -- JSON staticSignature
      tags          TEXT NOT NULL,      -- space-joined tag string (for LIKE search)
      content_len   INTEGER NOT NULL,
      harvested_at  TEXT NOT NULL       -- ISO timestamp
    );
    CREATE INDEX IF NOT EXISTS idx_components_type     ON components(type);
    CREATE INDEX IF NOT EXISTS idx_components_registry ON components(registry);
    CREATE INDEX IF NOT EXISTS idx_components_name     ON components(name);
  `);
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchItem(reg, name) {
  const url = reg.itemUrl(name);
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    // @ts-ignore
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** Run an async mapper over items with a fixed concurrency. */
async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = new Array(Math.min(concurrency, items.length))
    .fill(0)
    .map(async () => {
      while (true) {
        const i = idx++;
        if (i >= items.length) return;
        results[i] = await worker(items[i], i);
      }
    });
  await Promise.all(runners);
  return results;
}

// ---------------------------------------------------------------------------
// Harvest one registry
// ---------------------------------------------------------------------------

/**
 * @param {DatabaseSync} db
 * @param {typeof REGISTRIES[number]} reg
 * @param {{limit?: number, concurrency: number}} opts
 */
async function harvestRegistry(db, reg, opts) {
  if (!reg.itemsFile || !existsSync(reg.itemsFile)) {
    console.error(
      `! ${reg.name}: no items file (${reg.itemsFile}). ` +
        `Cannot enumerate — skipping. (Write a {items:[{name,type}]} JSON there.)`
    );
    return { fetched: 0, failed: [], skipped: 0 };
  }
  const manifest = JSON.parse(readFileSync(reg.itemsFile, 'utf8'));
  let items = manifest.items || [];
  if (opts.limit) items = items.slice(0, opts.limit);
  console.error(`> ${reg.name}: ${items.length} items, concurrency ${opts.concurrency}`);

  const upsert = db.prepare(`
    INSERT OR REPLACE INTO components
      (id, registry, name, type, deps, reg_deps, file_count, files, signature, tags, content_len, harvested_at)
    VALUES
      (?,  ?,        ?,    ?,    ?,    ?,        ?,          ?,     ?,         ?,    ?,           ?)
  `);

  const failed = [];
  let ok = 0;
  let done = 0;
  const now = new Date().toISOString();

  const outcomes = await mapPool(items, opts.concurrency, async (it) => {
    const id = `${reg.name}/${it.name}`;
    try {
      const j = await fetchItem(reg, it.name);
      const files = Array.isArray(j.files) ? j.files : [];
      const content = files.map((f) => f.content || '').join('\n');
      const sig = parseStaticSignature(content, {
        dependencies: j.dependencies,
        registryDependencies: j.registryDependencies,
      });
      const tags = deriveTags(it.name, it.type, sig);
      return {
        id,
        row: [
          id,
          reg.name,
          it.name,
          it.type || (j.type ? String(j.type).replace(/^registry:/, '') : 'unknown'),
          JSON.stringify(normalizeDeps(j.dependencies)),
          JSON.stringify(j.registryDependencies || []),
          files.length,
          JSON.stringify(files.map((f) => f.path)),
          JSON.stringify(sig),
          tags.join(' '),
          content.length,
          now,
        ],
      };
    } catch (e) {
      return { id, name: it.name, error: e.status ? `HTTP ${e.status}` : e.message };
    } finally {
      done++;
      if (done % 25 === 0 || done === items.length) {
        process.stderr.write(`\r  ...${done}/${items.length}`);
      }
    }
  });
  process.stderr.write('\n');

  // Write rows serially (node:sqlite is synchronous).
  for (const o of outcomes) {
    if (o.error) {
      failed.push({ name: o.name, error: o.error });
    } else {
      upsert.run(...o.row);
      ok++;
    }
  }

  return { fetched: ok, failed, skipped: 0 };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const a = { limit: 0, concurrency: 10, db: DEFAULT_DB, registry: null };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--limit') a.limit = parseInt(argv[++i], 10) || 0;
    else if (t === '--concurrency') a.concurrency = parseInt(argv[++i], 10) || 10;
    else if (t === '--db') a.db = resolve(argv[++i]);
    else if (t === '--registry') a.registry = argv[++i];
  }
  return a;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!existsSync(CATALOG_DIR)) mkdirSync(CATALOG_DIR, { recursive: true });

  const db = new DatabaseSync(args.db);
  db.exec('PRAGMA journal_mode = WAL;');
  initSchema(db);

  const regs = args.registry
    ? REGISTRIES.filter((r) => r.name === args.registry)
    : REGISTRIES;
  if (regs.length === 0) {
    console.error(`No registry named ${args.registry}. Known: ${REGISTRIES.map((r) => r.name).join(', ')}`);
    process.exit(1);
  }

  const t0 = Date.now();
  let totalFetched = 0;
  const allFailed = [];

  for (const reg of regs) {
    const r = await harvestRegistry(db, reg, {
      limit: args.limit,
      concurrency: args.concurrency,
    });
    totalFetched += r.fetched;
    for (const f of r.failed) allFailed.push({ registry: reg.name, ...f });
  }

  const rows = db.prepare('SELECT COUNT(*) AS n FROM components').get();
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  console.error('');
  console.error('='.repeat(60));
  console.error(`Harvest complete in ${secs}s`);
  console.error(`  fetched (this run): ${totalFetched}`);
  console.error(`  failed  (this run): ${allFailed.length}`);
  console.error(`  rows in DB total:   ${rows.n}`);
  console.error(`  db: ${args.db}`);
  if (allFailed.length) {
    console.error('  failures:');
    // group by error for readability
    const byErr = {};
    for (const f of allFailed) {
      (byErr[f.error] ||= []).push(f.name);
    }
    for (const [err, names] of Object.entries(byErr)) {
      console.error(`    [${err}] (${names.length}): ${names.join(', ')}`);
    }
  }
  db.close();
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
