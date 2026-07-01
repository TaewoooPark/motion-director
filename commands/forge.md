---
description: Run the full UIForge pipeline on a brief — thesis, one direction, tokens first, sourced components, budgeted composition, blind critique, forced subtraction.
argument-hint: "[what to build, e.g. 'pricing section for a dev-tools startup, restrained']"
---

Forge the UI described in **$ARGUMENTS** (if empty, ask for the brief and the
surface). Run the UIForge pipeline in order — do not skip to components. Use the
`uiforge:design-director` skill as the brain and pull in the other skills at
their step.

1. **Thesis** — write one sentence: who it's for, the feeling on load, where the
   eye lands, and the single thing it's remembered by. Confirm it before building.
2. **Direction** — commit to ONE point of view from the design-director's
   `directions.md` (Editorial / Precise / Brutalist / Warm / Maximalist). State it.
3. **Tokens first** — invoke **`uiforge:design-tokens`**: emit `tokens.css`
   (color roles, one type scale, 8px spacing, one radius/shadow) + `motion.ts`,
   derived from the direction. Override the shadcn/Tailwind defaults. Nothing
   downstream uses a value that isn't a token.
4. **Source components** — install from the registry (shadcn MCP / CLI; run
   `/uiforge:setup` first if the project isn't wired). Bias to the restrained
   cluster in `registry-map.md`; at most one effect-maximalist piece, only as the
   signature. Verify props. Never hand-author component source.
5. **Compose to the budget** — one signature moment; everything else quiet. Direct
   motion with **`uiforge:motion`** (one signature, reduced-motion) and copy with
   **`uiforge:content`** (outcome labels, real states, no hype). Design every
   reachable state (loading / empty / error), not just the happy path.
6. **Critique + subtract** — run **`/uiforge:critique`**: judge the rendered
   result blind, grep the anti-slop patterns, and **remove the one least-justified
   thing**.

Then report: the thesis, the chosen direction, the emitted signature (palette /
type ratio / spacing / motion), what you installed and from where, the one
signature moment — and what you subtracted.
