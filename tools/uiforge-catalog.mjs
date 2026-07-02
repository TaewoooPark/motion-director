#!/usr/bin/env node
// @ts-check
/**
 * UIForge catalog query CLI (M1b) over tools/catalog/catalog.db.
 *
 * Commands:
 *   node --no-warnings tools/uiforge-catalog.mjs stats [--json]
 *   node --no-warnings tools/uiforge-catalog.mjs search "<query>" [--type ui] [--limit N] [--json]
 *   node --no-warnings tools/uiforge-catalog.mjs show <id-or-name> [--json]
 *   node --no-warnings tools/uiforge-catalog.mjs near <signature.json> [--limit N] [--type ui] [--json]
 *
 * `near` (M2 preview): ranks items by a simple static-signature distance against
 * a spec file. See signatureDistance() — a basic version is implemented; the
 * full weighting/normalisation is a TODO for M2.
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = join(__dirname, 'catalog', 'catalog.db');

function openDb(dbPath) {
  if (!existsSync(dbPath)) {
    console.error(`catalog db not found: ${dbPath}\nRun: node --no-warnings tools/uiforge-harvest.mjs`);
    process.exit(1);
  }
  return new DatabaseSync(dbPath, { readOnly: true });
}

/** @param {any} row */
function hydrate(row) {
  return {
    id: row.id,
    registry: row.registry,
    name: row.name,
    type: row.type,
    deps: JSON.parse(row.deps),
    regDeps: JSON.parse(row.reg_deps),
    fileCount: row.file_count,
    files: JSON.parse(row.files),
    signature: JSON.parse(row.signature),
    tags: row.tags,
    contentLen: row.content_len,
    harvestedAt: row.harvested_at,
  };
}

// ---------------------------------------------------------------------------
// stats
// ---------------------------------------------------------------------------

function cmdStats(db, opts) {
  const total = db.prepare('SELECT COUNT(*) n FROM components').get().n;
  const byType = db
    .prepare('SELECT type, COUNT(*) n FROM components GROUP BY type ORDER BY n DESC')
    .all();
  const byRegistry = db
    .prepare('SELECT registry, COUNT(*) n FROM components GROUP BY registry ORDER BY n DESC')
    .all();

  // signature-derived aggregates (parse JSON in JS; N is small)
  const rows = db.prepare('SELECT signature FROM components').all();
  let focusVisible = 0, aria = 0, role = 0, srOnly = 0, anyA11y = 0;
  let rawColor = 0, variants = 0, motion = 0, radix = 0;
  const radiiCount = {};
  const roleCount = {};
  for (const r of rows) {
    const s = JSON.parse(r.signature);
    if (s.a11y.hasFocusVisible) focusVisible++;
    if (s.a11y.hasAria) aria++;
    if (s.a11y.hasRole) role++;
    if (s.a11y.hasSrOnly) srOnly++;
    if (s.a11y.hasFocusVisible || s.a11y.hasAria || s.a11y.hasRole || s.a11y.hasSrOnly) anyA11y++;
    if (s.usesRawColor) rawColor++;
    if (s.hasVariants) variants++;
    if (s.motion) motion++;
    if (s.depsRadix) radix++;
    for (const rad of s.radii || []) radiiCount[rad] = (radiiCount[rad] || 0) + 1;
    for (const role of s.colorTokens || []) roleCount[role] = (roleCount[role] || 0) + 1;
  }
  const pct = (n) => (total ? ((100 * n) / total).toFixed(1) + '%' : '0%');
  const topRadii = Object.entries(radiiCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topRoles = Object.entries(roleCount).sort((a, b) => b[1] - a[1]).slice(0, 12);

  const out = {
    total,
    byType: Object.fromEntries(byType.map((r) => [r.type, r.n])),
    byRegistry: Object.fromEntries(byRegistry.map((r) => [r.registry, r.n])),
    a11yCoverage: {
      anyA11y: { n: anyA11y, pct: pct(anyA11y) },
      focusVisible: { n: focusVisible, pct: pct(focusVisible) },
      aria: { n: aria, pct: pct(aria) },
      role: { n: role, pct: pct(role) },
      srOnly: { n: srOnly, pct: pct(srOnly) },
    },
    usesRawColor: { n: rawColor, pct: pct(rawColor) },
    hasVariants: { n: variants, pct: pct(variants) },
    motion: { n: motion, pct: pct(motion) },
    depsRadix: { n: radix, pct: pct(radix) },
    topRadii: Object.fromEntries(topRadii),
    topColorRoles: Object.fromEntries(topRoles),
  };

  if (opts.json) {
    process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    return;
  }

  const L = [];
  L.push(`Catalog: ${total} components`);
  L.push('');
  L.push('By type:');
  for (const r of byType) L.push(`  ${r.type.padEnd(12)} ${r.n}`);
  L.push('');
  L.push('By registry:');
  for (const r of byRegistry) L.push(`  ${r.registry.padEnd(20)} ${r.n}`);
  L.push('');
  L.push('a11y coverage:');
  L.push(`  any a11y signal   ${anyA11y.toString().padStart(4)}  ${pct(anyA11y)}`);
  L.push(`  focus-visible:    ${focusVisible.toString().padStart(4)}  ${pct(focusVisible)}`);
  L.push(`  aria-*            ${aria.toString().padStart(4)}  ${pct(aria)}`);
  L.push(`  role=             ${role.toString().padStart(4)}  ${pct(role)}`);
  L.push(`  sr-only           ${srOnly.toString().padStart(4)}  ${pct(srOnly)}`);
  L.push('');
  L.push(`uses raw color:     ${rawColor.toString().padStart(4)}  ${pct(rawColor)}`);
  L.push(`has cva variants:   ${variants.toString().padStart(4)}  ${pct(variants)}`);
  L.push(`has motion:         ${motion.toString().padStart(4)}  ${pct(motion)}`);
  L.push(`deps on radix:      ${radix.toString().padStart(4)}  ${pct(radix)}`);
  L.push('');
  L.push('Top radii:');
  for (const [k, v] of topRadii) L.push(`  ${k.padEnd(10)} ${v}`);
  L.push('');
  L.push('Top color roles:');
  for (const [k, v] of topRoles) L.push(`  ${k.padEnd(22)} ${v}`);
  process.stdout.write(L.join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

function cmdSearch(db, query, opts) {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    console.error('search needs a query string');
    process.exit(1);
  }
  const like = `%${q}%`;
  const params = [like, like];
  let sql =
    'SELECT * FROM components WHERE (LOWER(name) LIKE ? OR LOWER(tags) LIKE ?)';
  if (opts.type) {
    sql += ' AND type = ?';
    params.push(opts.type);
  }
  sql += ' ORDER BY (LOWER(name) = ?) DESC, LENGTH(name) ASC, name ASC';
  params.push(q);
  if (opts.limit) {
    sql += ' LIMIT ?';
    params.push(opts.limit);
  }
  const rows = db.prepare(sql).all(...params).map(hydrate);

  if (opts.json) {
    process.stdout.write(JSON.stringify(rows, null, 2) + '\n');
    return;
  }
  if (rows.length === 0) {
    process.stdout.write(`no matches for "${query}"\n`);
    return;
  }
  const L = [`${rows.length} match(es) for "${query}":`, ''];
  for (const r of rows) {
    const s = r.signature;
    const flags = [
      s.hasVariants ? `variants:${s.variantAxes}` : null,
      s.depsRadix ? 'radix' : null,
      s.motion ? 'motion' : null,
      s.a11y.hasFocusVisible ? 'focus-visible' : null,
      s.usesRawColor ? 'raw-color' : null,
    ].filter(Boolean);
    L.push(`  ${r.id}  [${r.type}]  files=${r.fileCount}`);
    L.push(`      radii=${JSON.stringify(s.radii)}  roles=${s.colorTokens.length}  ${flags.join(' ')}`);
    if (r.regDeps.length) L.push(`      regDeps: ${r.regDeps.join(', ')}`);
  }
  process.stdout.write(L.join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// show
// ---------------------------------------------------------------------------

function cmdShow(db, key, opts) {
  let row = db.prepare('SELECT * FROM components WHERE id = ?').get(key);
  if (!row) row = db.prepare('SELECT * FROM components WHERE name = ? ORDER BY type LIMIT 1').get(key);
  if (!row) {
    console.error(`not found: ${key}`);
    process.exit(1);
  }
  const item = hydrate(row);
  if (opts.json) {
    process.stdout.write(JSON.stringify(item, null, 2) + '\n');
    return;
  }
  process.stdout.write(JSON.stringify(item, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// near (M2 preview) — signature distance ranking
// ---------------------------------------------------------------------------

/**
 * Static-signature distance between a spec and an item signature.
 * Lower = closer. Range roughly [0, 1] per active term, summed & normalised.
 *
 * Basic version implemented: radii overlap + color-role overlap + spacing
 * overlap (Jaccard distances), plus small penalties for raw-color mismatch.
 *
 * TODO(M2): proper weighting from the spec (radius/color/spacing/density),
 * numeric radius bucketing (map spec radius px -> named tailwind step),
 * density from spacingScale spread, and a11y as a hard filter rather than a
 * soft term. Wire real weights once the SPEC schema for M2 is frozen.
 *
 * @param {object} spec   partial signature-like object from the spec file
 * @param {object} itemSig  a component's staticSignature
 * @returns {number}
 */
export function signatureDistance(spec, itemSig) {
  const jaccardDist = (a = [], b = []) => {
    const A = new Set(a), B = new Set(b);
    if (A.size === 0 && B.size === 0) return 0;
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    const union = A.size + B.size - inter;
    return union === 0 ? 0 : 1 - inter / union;
  };

  const terms = [];
  if (spec.radii) terms.push(jaccardDist(spec.radii, itemSig.radii));
  if (spec.colorTokens) terms.push(jaccardDist(spec.colorTokens, itemSig.colorTokens));
  if (spec.spacingScale) terms.push(jaccardDist(spec.spacingScale, itemSig.spacingScale));
  if (typeof spec.usesRawColor === 'boolean') {
    terms.push(spec.usesRawColor === itemSig.usesRawColor ? 0 : 1);
  }
  if (terms.length === 0) return 1; // nothing to compare on
  return terms.reduce((a, b) => a + b, 0) / terms.length;
}

function cmdNear(db, specPath, opts) {
  if (!specPath || !existsSync(resolve(specPath))) {
    console.error(`spec file not found: ${specPath}`);
    console.error('Expected a JSON file with any of: radii[], colorTokens[], spacingScale[], usesRawColor');
    process.exit(1);
  }
  const spec = JSON.parse(readFileSync(resolve(specPath), 'utf8'));
  let sql = 'SELECT * FROM components';
  const params = [];
  if (opts.type) {
    sql += ' WHERE type = ?';
    params.push(opts.type);
  }
  const rows = db.prepare(sql).all(...params).map(hydrate);
  const ranked = rows
    .map((r) => ({ item: r, dist: signatureDistance(spec, r.signature) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, opts.limit || 15);

  if (opts.json) {
    process.stdout.write(
      JSON.stringify(
        ranked.map((r) => ({ id: r.item.id, type: r.item.type, dist: +r.dist.toFixed(4), signature: r.item.signature })),
        null,
        2
      ) + '\n'
    );
    return;
  }
  const L = [`Nearest ${ranked.length} to spec ${specPath}:`, '  (M2 preview — basic Jaccard distance; see signatureDistance TODO)', ''];
  for (const r of ranked) {
    L.push(`  ${r.dist.toFixed(4)}  ${r.item.id}  [${r.item.type}]  radii=${JSON.stringify(r.item.signature.radii)}`);
  }
  process.stdout.write(L.join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// arg parsing + dispatch
// ---------------------------------------------------------------------------

function parseFlags(argv) {
  const flags = { json: false, type: null, limit: 0, db: DEFAULT_DB };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--json') flags.json = true;
    else if (t === '--type') flags.type = argv[++i];
    else if (t === '--limit') flags.limit = parseInt(argv[++i], 10) || 0;
    else if (t === '--db') flags.db = resolve(argv[++i]);
    else if (t === '--near') flags._near = argv[++i]; // alt form
    else positional.push(t);
  }
  return { flags, positional };
}

function usage() {
  process.stdout.write(
    [
      'UIForge catalog query CLI',
      '',
      'Commands:',
      '  stats [--json]',
      '  search "<query>" [--type ui] [--limit N] [--json]',
      '  show <id-or-name> [--json]',
      '  near <signature.json> [--type ui] [--limit N] [--json]   (M2 preview)',
      '',
      'Global: --db <path>  (default tools/catalog/catalog.db)',
    ].join('\n') + '\n'
  );
}

function main() {
  const { flags, positional } = parseFlags(process.argv.slice(2));
  const cmd = positional[0];
  if (!cmd || cmd === 'help' || cmd === '--help') {
    usage();
    return;
  }
  const db = openDb(flags.db);
  try {
    switch (cmd) {
      case 'stats':
        cmdStats(db, flags);
        break;
      case 'search':
        cmdSearch(db, positional[1], flags);
        break;
      case 'show':
        cmdShow(db, positional[1], flags);
        break;
      case 'near':
        cmdNear(db, positional[1] || flags._near, flags);
        break;
      default:
        console.error(`unknown command: ${cmd}`);
        usage();
        process.exit(1);
    }
  } finally {
    db.close();
  }
}

main();
