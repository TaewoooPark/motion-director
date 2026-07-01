# Token kits — ground truth, not a blank page

The fastest way past the median prior (Inter + slate + purple) is to **not start
from scratch.** Each kit is a complete, ready `tokens.css` with a real,
non-default typeface, a committed palette (no purple/slate defaults), a type
scale, radius, shadow, and a reduced-motion path — tuned to one direction and
**already passing the linter.**

| Kit | Direction | Display / text / mono | Accent |
|---|---|---|---|
| [`editorial.css`](editorial.css) | Editorial | Fraunces / Newsreader / — | rust `#B4472E` |
| [`precise.css`](precise.css) | Precise / Mechanical | Hanken Grotesk / — / JetBrains Mono | electric blue `#4C8DFF` |
| [`brutalist.css`](brutalist.css) | Brutalist | Archivo / — / Space Mono | flat yellow `#FFE500` |
| [`warm.css`](warm.css) | Warm / Organic | Bricolage Grotesque / — / JetBrains Mono | terracotta `#E07A5F` |
| [`maximalist.css`](maximalist.css) | Maximalist | Unbounded / Hanken Grotesk / — | magenta `#FF2E88` |

None of these faces is Inter/Roboto/system-ui — that alone clears the biggest
BLOCKER. All are free (Google Fonts / Fontsource).

## Use a kit

1. Pick the kit that matches your chosen direction.
2. Install its fonts (each file's header has the exact `npm i @fontsource…` line)
   and `@import` them at the top of your CSS entry — or add the Google Fonts
   `<link>`.
3. Copy the kit's contents into your project's `src/index.css` (or `app/globals.css`).
4. Build with `var(--…)` / the generated utilities (`bg-bg`, `text-fg`,
   `bg-primary`, `bg-surface`, `text-muted`, `border-border`) — **never raw hex.**
5. Run `node <plugin>/tools/uiforge-lint.mjs . --strict` — it should pass.

Tune the palette/scale to the brand, but stay on the roles and the grid. To
derive a kit *from a reference image* instead, use `/uiforge:reskin`.
