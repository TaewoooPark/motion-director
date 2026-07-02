# UIForge Component Catalog (M1b)

An asset DB of shadcn-compatible registry components, harvested into SQLite with a
per-item **static signature** parsed from source. This is the backing store for the
**SOURCE** stage: later (M2) a design spec (radius / color / spacing / density) is
matched against each item's static signature to rank install candidates.

- Harvester: [`../uiforge-harvest.mjs`](../uiforge-harvest.mjs)
- Query CLI: [`../uiforge-catalog.mjs`](../uiforge-catalog.mjs)
- DB: `catalog.db` (this dir) — SQLite, ~294 rows for `@shadcn`.
- Item manifest: `shadcn-items.json` — the `{name,type}` list the harvester reads.

## Storage: `node:sqlite` (zero deps)

Uses Node's **built-in** `node:sqlite` (`DatabaseSync`). No `better-sqlite3`, no npm
dependency. Requires Node ≥ 22 (tested on v24.13). Node prints an
`ExperimentalWarning` for `node:sqlite`; every command below runs `node --no-warnings`
to suppress it. The subset of the API used (`DatabaseSync`, `prepare`, `run`, `all`,
`get`, `exec`) is stable in practice.

## Quick start

```bash
# Harvest all configured registries into catalog.db (idempotent — INSERT OR REPLACE)
node --no-warnings tools/uiforge-harvest.mjs

# Query
node --no-warnings tools/uiforge-catalog.mjs stats
node --no-warnings tools/uiforge-catalog.mjs search "dialog" --limit 6
node --no-warnings tools/uiforge-catalog.mjs search "card" --type ui
node --no-warnings tools/uiforge-catalog.mjs show @shadcn/button
node --no-warnings tools/uiforge-catalog.mjs near spec.json --type ui   # M2 preview
# add --json to stats / search / show / near for machine-readable output
```

Harvester flags: `--registry @shadcn`, `--limit N` (first N items, smoke test),
`--concurrency 12` (default 10), `--db <path>`.

## Schema

Single table `components`:

| column         | type    | notes                                                        |
| -------------- | ------- | ------------------------------------------------------------ |
| `id`           | TEXT PK | `@shadcn/button` (`<registry>/<name>`)                       |
| `registry`     | TEXT    | `@shadcn`                                                    |
| `name`         | TEXT    | `button`                                                     |
| `type`         | TEXT    | `ui` \| `block` \| `example` \| `internal` \| `lib` \| `hook` \| `style` |
| `deps`         | TEXT    | JSON array of npm deps (e.g. `["@radix-ui/react-slot"]`)     |
| `reg_deps`     | TEXT    | JSON array of registry deps (other items it pulls in)        |
| `file_count`   | INTEGER | number of files in the registry item                        |
| `files`        | TEXT    | JSON array of file paths                                     |
| `signature`    | TEXT    | JSON **staticSignature** (see below)                         |
| `tags`         | TEXT    | space-joined tags derived from name/type/colorTokens/flags   |
| `content_len`  | INTEGER | total chars of concatenated source (rough size proxy)        |
| `harvested_at` | TEXT    | ISO timestamp                                                |

Indexes on `type`, `registry`, `name`. Re-runs use `INSERT OR REPLACE` keyed on `id`,
so harvesting again updates rows in place (safe to re-run). WAL journal mode is set.

Search is `LIKE` over `name` + `tags` (no FTS5 dependency needed at this scale; the
`tags` column is the searchable denormalisation). Exact-name matches rank first.

## staticSignature fields

Parsed from the concatenated file `content` with cheap regex — **no rendering**:

| field          | meaning                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `radii`        | set of `rounded-*` steps + arbitrary `rounded-[..]` values used         |
| `hasVariants`  | uses `cva(` / `class-variance-authority`                                |
| `variantAxes`  | count of top-level keys in the `variants: { … }` block (e.g. variant+size = 2) |
| `colorTokens`  | distinct **semantic** color roles referenced (`primary`, `muted-foreground`, `border`, `chart-1`, …) via `bg-/text-/border-/ring-/…` utilities or `var(--role)` |
| `usesRawColor` | any raw hex, `rgb()/hsl()` literal, or arbitrary `bg-[#..]`             |
| `spacingScale` | distinct numeric steps on `p/px/py/pt…/m…/gap/space-` (`px` + numbers)   |
| `a11y`         | booleans: `hasFocusVisible` (`focus-visible:`), `hasAria` (`aria-*`), `hasRole` (`role=`), `hasSrOnly` (`sr-only`) |
| `motion`       | uses `transition-` / `animate-` / `data-[state…]:` / `duration-`        |
| `depsRadix`    | depends on `@radix-ui/*` (from `dependencies` or source)                |

Example (`@shadcn/button`):

```json
{
  "radii": ["md"], "hasVariants": true, "variantAxes": 2,
  "colorTokens": ["accent","background","destructive","foreground","input","primary","ring","secondary", "..."],
  "usesRawColor": false, "spacingScale": ["2","3","4","8"],
  "a11y": {"hasFocusVisible": true, "hasAria": false, "hasRole": false, "hasSrOnly": false},
  "motion": true, "depsRadix": true
}
```

## `near` — M2 signature-distance preview

`uiforge-catalog.mjs near <spec.json>` ranks items by `signatureDistance(spec, itemSig)`
(exported from `uiforge-catalog.mjs`). The spec JSON may contain any of `radii[]`,
`colorTokens[]`, `spacingScale[]`, `usesRawColor`. Current impl is a basic mean of
Jaccard distances over the overlapping fields.

**TODO(M2)** (marked in `signatureDistance`): real weighting from the spec's
radius/color/spacing/**density**, numeric radius bucketing (map a spec radius in px to
the nearest named Tailwind step), density inferred from `spacingScale` spread, and
treating a11y as a hard filter instead of a soft term. Wire real weights once the M2
SPEC schema is frozen.

## Adding a registry (registry-agnostic design)

The harvester is registry-agnostic. To add one, push an entry to the `REGISTRIES` array
in `uiforge-harvest.mjs`:

```js
{
  name: '@acme',
  itemUrl: (n) => `https://acme.dev/r/${n}.json`,
  itemsFile: join(CATALOG_DIR, 'acme-items.json'), // { items: [{name, type}, …] }
}
```

Everything else (fetch, signature parse, DB write) is generic. Provide an `itemsFile`
listing `{name, type}` so the run is reproducible without an MCP.

### How `shadcn-items.json` is produced

The `@shadcn` name/type list comes from the shadcn MCP
(`list_items_in_registries({registries:['@shadcn'], limit:0})`, ~419 items). Its text
output (lines like `- button (registry:ui) [@shadcn]`) is parsed into
`{name, type}` and written to `shadcn-items.json`. Committing that file makes the
harvest reproducible **without** the MCP (the harvester only reads the file). The
registry **index** at `/r/registry.json` is 404, so enumeration must come from the MCP,
not an index fetch.

## Known limits / gotchas

- **Only `@shadcn` is harvested now.** The config is registry-agnostic, but
  `@motion-primitives` and other third-party registries **rate-limit CI fetches (429)**,
  so they are intentionally not in the default run. Add them later per above.
- **~125 of 419 `@shadcn` items 404** at the New York static path
  (`https://ui.shadcn.com/r/styles/new-york/{name}.json`) and are recorded as failures,
  not stored. These are **systematic, not a harvester bug**:
  - all `registry:theme` items (`theme-*`) — no New York path;
  - several newer `registry:ui` primitives (combobox, native-select, direction,
    attachment, bubble, marker, message, message-scroller);
  - many newer `registry:example` demos (field-*, form-*, item-*, kbd-*, spinner-*,
    input-group-*, empty-*, button-group-*, native-select-*, signup-*, calendar-hijri).

  Net: **294 rows** stored. Re-run any time to pick up items once shadcn publishes them
  to the New York path.
- Item source is fetched from the **New York** style only
  (`/r/styles/new-york/{name}.json`). The default style variant is not separately
  harvested (signatures would be near-identical for our purposes).
- `node:sqlite` is **experimental** (ExperimentalWarning); pinned to Node ≥ 22 and run
  with `--no-warnings`.
- Signature parsing is **static regex over source text** — it can't see runtime/computed
  classes or Tailwind resolved from `@apply` in external CSS. It captures literal
  utility strings in the component source, which is what shadcn components ship.
