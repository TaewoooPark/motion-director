# Space & layout — quantize, then compose

Arbitrary spacing is the fastest tell that no system exists. Quantize everything,
then lay out with constraints, not hardcoded pixels.

## The spacing scale (8px grid)

- Every margin, padding, gap, and size is a **multiple of 8** (use **4** for fine
  steps). Off-grid values (5/7/13/15px) render blurry at 1.5×/2× density and read
  as ad-hoc.
- Expose a named ordinal scale (Carbon's is a good shape):
  `2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 160`px → `--space-1 …`.
- **No two steps closer than ~25%** — a real scale is non-linear, not 16/18/20.
- **Rhythm:** tight *within* a group, generous *between* groups (the space
  between sections > space within them). Start over-spaced, then subtract.

## Layout from primitives, not breakpoint soup

Set constraints and let the browser lay out (Every Layout):

- **Stack** — vertical rhythm via the owl `* + * { margin-block-start: … }`.
- **Cluster** — wrap a row of items with consistent gaps (nav, tags, buttons).
- **Sidebar / Switcher** — a fixed + fluid pair that reflows without a query.
- **Center** — cap the **measure** (`max-inline-size: 66ch`) and center the box.
- **Grid** — a 12-column grid you align everything to; break it *deliberately*
  for editorial asymmetry.

## Fluid over breakpoint jumps

- Scale type and space with **`clamp(min, preferred + vw, max)`** between an
  anchored small and large viewport (Utopia), instead of snapping at breakpoints.
  e.g. `font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem)`.
- Design **mobile-first**; add a breakpoint only where the content genuinely
  needs one. Standard tiers: **640 · 768 · 1024 · 1280 · 1536** (Tailwind) or
  576/768/992/1200/1400 (Bootstrap).

## Density & ergonomics

- Interactive targets **≥ 44×44pt** (Apple) / 48dp (Material); ≥ 24px is the WCAG
  floor; keep ≥ 8px between targets. Anchor frequent actions to edges/corners
  (Fitts).
- Respect safe-area insets; inputs **≥ 16px** font (prevents iOS zoom); decorative
  layers get `pointer-events: none`.
