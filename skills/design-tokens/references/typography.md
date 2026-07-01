# Typography — one scale, distinctive faces

Four choices decide body text (Butterick): **face, size, line-height, measure.**
Get those right and you have 90% of typographic quality. Then make the display
face a *choice*, not a default.

## Faces (≤ 2, never the defaults)

- One **display** face (headlines) + one **text** face (body). A **mono** utility
  face is a permitted third.
- The primary face is **not** Inter, Roboto, Arial, Open Sans, Lato, or
  `system-ui` — and don't reflex-reach for Space Grotesk. Default fonts signal
  default thinking. Pick a face with a point of view that fits the direction (a
  characterful grotesk, a modern serif/didone for editorial, a humanist sans for
  warm, a mono for brutalist) and commit.
- You can pair a display and text face from the **same superfamily** for safe
  contrast, or contrast serif display + sans text deliberately.

## Scale — from ONE modular ratio

Anchor body at **16px** and derive ~7–8 steps by multiplying by one ratio:

- **1.2 / 1.25** — dense product UI, dashboards (Precise/Warm)
- **1.333 (perfect fourth)** — clear hierarchy, most marketing (default choice)
- **1.5 / 1.618** — editorial / hero drama (Editorial/Maximalist)

Example at **1.333** from 16px: `12 · 14 · 16 · 21 · 28 · 37 · 50 · 66px`
(round to taste). Expose as `--text-xs … --text-display`. Name by role
(Display/Headline/Title/Body/Label) or size — but there is **one** scale.

## Hierarchy from weight + color, not size alone

- Adjacent levels differ by **≥ 1.33×** in size; display-to-body ideally **≥ 3×**.
- Use **weight extremes** (≤ 200 or ≥ 700 for display vs 400 body) — not
  400-vs-600. Three text tiers by color: `--fg` / `--muted` / a lighter step.
- "Emphasize by de-emphasizing": lower the contrast of everything around the
  thing that should lead, instead of shouting louder.

## Body text specifics

- **Measure 45–75ch** (≈ 66 ideal; ~40–50 for multi-column). Never full-viewport
  paragraphs; never center running text over ~3 lines.
- **Line-height by role:** body **1.4–1.6**; large display/headline **1.1–1.25**
  (tighter as size grows). Body size **≥ 16px**.
- **Details that read as craft:** curly quotes `“” ‘’` and real dashes `– —`; one
  space after a period; `font-variant-numeric: tabular-nums` for numbers/tables;
  small **letterspacing (+5–12%)** on all-caps/small-caps; bold **or** italic,
  not both.
