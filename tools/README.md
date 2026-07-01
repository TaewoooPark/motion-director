# UIForge tools — the Gate

Slop is a build failure here, not a suggestion. These are executable, zero-dependency
tools (Node standard library only) that the skills and commands run.

## `uiforge-lint.mjs` — the failing linter

Scans a project's `src`/`app`/`index.html` for the named slop tells **and** token
violations, prints a report + score, and **exits non-zero** on any BLOCKER.

```bash
node <plugin>/tools/uiforge-lint.mjs [dir] [--strict] [--json] [--quiet]
# from within a Claude Code plugin, <plugin> is ${CLAUDE_PLUGIN_ROOT}
```

- **BLOCKERs (always fail):** default font (Inter/system-ui/…), AI purple/indigo,
  gradient headline text, emoji-as-UI, hype copy, motion without a reduced-motion path.
- **Warnings (reported + scored, advisory):** raw hex at point of use, Tailwind
  arbitrary values, off-8px-grid spacing, maxed radius + shadow, gradient overuse,
  unmodified slate/zinc, infinite loops, no design-token layer.
- `--strict` also fails on accumulated warnings (`--max-score 0`).

`/uiforge:critique` runs this automatically; wire it into your project so slop can't land:

**pre-commit** (`.husky/pre-commit` or `.git/hooks/pre-commit`):
```bash
node "$UIFORGE"/tools/uiforge-lint.mjs . --strict || exit 1
```

**CI** (GitHub Actions step):
```yaml
- run: node path/to/uiforge/tools/uiforge-lint.mjs . --strict
```

## `tokens.template.css` — the on-scale vocabulary

Copy to the project and fill from the chosen direction (via the `design-tokens`
skill). Defining tokens first is what lets the build **pass** the linter: every
value derives from a token, on the 8px grid, with a real (non-default) font and one
accent. Emit it **before** any component.

The two tools are a pair: the template gives the model a constrained vocabulary,
the linter rejects anything that steps outside it. Or skip the blank page and
start from a ready **kit** (`kits/`).

## `create-uiforge.mjs` — wire a project so slop can't land

```bash
node <plugin>/tools/create-uiforge.mjs <editorial|precise|brutalist|warm|maximalist> [dir]
```

Into an existing project it drops the direction's **token kit** → `src/index.css`,
copies the **linter** → `scripts/`, adds a `lint:ui` npm script, installs a
**pre-commit hook**, and writes a **CI workflow** (`.github/workflows/uiforge.yml`).
A freshly-wired project (kit, no components yet) scores **A+**. Then install the
kit's fonts and build on the tokens.

## `uiforge-score.mjs` — grade any UI A–F (a review tool)

```bash
node <plugin>/tools/uiforge-score.mjs [dir]
```

Wraps the linter into a letter grade (any BLOCKER = **F**) + a 0–100 + the top
tells — for reviewing a project or a PR, not just your own output. Drives
`/uiforge:score`. Example: the A/B apps grade **F**; a kit-wired project grades
**A+**.
