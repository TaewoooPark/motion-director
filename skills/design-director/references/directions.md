# Design directions — commit to one point of view

"Modern and clean" is the median — it's what everyone defaults to, so it reads as
nobody. A masterpiece has a **point of view**. Pick **one** direction per project
and commit; that single choice fixes your tokens, your type, your color, your
motion, and which registries you draw from. "Style is consistent constraint" —
committing collapses a thousand later decisions into a recognizable whole.

Each direction below is concrete: a type signature, a color signature, a space/
surface signature, the matching **motion direction** (see the `motion` skill),
what it fits, what it kills, and a calibration target. Read one; ignore the rest.

- [1. Editorial](#1-editorial) · [2. Precise / Mechanical](#2-precise--mechanical) · [3. Brutalist / Neubrutalist](#3-brutalist--neubrutalist) · [4. Warm / Organic](#4-warm--organic) · [5. Maximalist / Expressive](#5-maximalist--expressive)

---

## 1. Editorial

**Personality.** Magazine, not app. Big type does the talking; generous negative
space is the luxury signal; asymmetry over centered symmetry.

- **Type:** a real **display face** (a modern serif/didone, or a characterful
  grotesk) paired with a readable text face. Scale ratio **1.5–1.618**; one
  dominant type moment per view. Never Inter as the display.
- **Color:** near-monochrome — ink on **paper** (warm off-white like `#F9F7F3`,
  not pure white) — plus **one** restrained accent used sparingly.
- **Space/surface:** wide margins, an **asymmetric** 12-column grid you break
  deliberately; hairline rules over shadows; almost no elevation.
- **Motion:** *editorial/restrained* — one orchestrated page-load entrance, then
  very subtle in-view; nothing loops.
- **Fits:** content sites, portfolios, launch/marketing pages, essays. **Kills:**
  dense dashboards, data tools.
- **Calibration:** Stripe press pages, Vercel homepage, a well-set magazine.

## 2. Precise / Mechanical

**Personality.** The Swiss-grid-meets-Linear register: objective, calm,
confident, nothing wasted. Structure is felt, not decorated.

- **Type:** a neutral-but-deliberate **grotesk** (not Inter/Roboto); tight scale
  **1.2–1.25**; hierarchy from weight + tabular alignment, not size drama.
- **Color:** near-monochrome (dark or light) with **tonal surfaces** and **one**
  restrained accent; or a strict black/white + single primary. High contrast,
  WCAG-safe.
- **Space/surface:** rigorous 12-col + **8px baseline**, everything aligned;
  borders and *faint* low shadows over big elevation; one small radius.
- **Motion:** *precise/mechanical* — `cubic-bezier(0.2,0,0,1)`, 120–240ms,
  stagger 20–40ms, interruptible, ~no overshoot.
- **Fits:** dev tools, dashboards, B2B, docs. **Kills:** playful consumer brands.
- **Calibration:** Linear, Raycast, Vercel dashboard, Müller-Brockmann.

## 3. Brutalist / Neubrutalist

**Personality.** Raw, loud, honest. Content over ornament; the layout itself is
the statement. Neubrutalism keeps the boldness but adds clearer hierarchy.

- **Type:** **mono** or a heavy grotesk at **extreme** sizes; big weight jumps;
  scale ≥ 1.414.
- **Color:** stark high-contrast — flat **brights** on black/white; no gradients.
- **Space/surface:** blocky, aligned-but-asymmetric; **thick borders (2–4px)**;
  **hard offset shadows** (solid color, `0` blur) instead of soft elevation;
  radius near 0 (or one deliberate chunky radius).
- **Motion:** snappy or intentionally abrupt; kinetic is allowed but keep the
  budget — one signature.
- **Fits:** creative brands, portfolios, statement pages, dev-culture products.
  **Kills:** trust-critical finance/health, enterprise.
- **Calibration:** Gumroad-era, tasteful neubrutalist sites (not the meme kind).

## 4. Warm / Organic

**Personality.** Human, soft, tactile. Things have weight and settle. Warmth
without wobble.

- **Type:** a **humanist** sans or a warm serif; comfortable scale **1.25–1.333**;
  softer weights.
- **Color:** **warm neutrals** + one warm accent; lower saturation; avoid clinical
  greys. Pair every text color to its surface's hue.
- **Space/surface:** generous, comfortable spacing; **one consistent medium
  radius**; **soft shadows** with a single light source (never colored glow).
- **Motion:** *soft/organic* springs — `stiffness ~220, damping ~26`, bounce
  0.15–0.25; gentle, interruptible.
- **Fits:** consumer apps, community, wellness, education, onboarding. **Kills:**
  dense data grids, cold enterprise tooling.
- **Calibration:** Family (app), Arc, iOS sheets.

## 5. Maximalist / Expressive

**Personality.** Bold, layered, high-energy — and still disciplined. Maximal is
not chaotic: you get **one** signature and a controlled system, just louder.

- **Type:** an **expressive display** + a strong text face; big scale **≥ 1.5**;
  dramatic contrast.
- **Color:** rich and saturated but a **controlled** palette (one dominant, not a
  rainbow); deliberate gradients allowed as *the* signature, never the default
  purple.
- **Space/surface:** layered, overlapping compositions **on a grid**; bolder
  shadows/gradients used with intent.
- **Motion:** *kinetic/expressive* — punchy springs, visible overshoot ok
  (bounce 0.3–0.4); budget still holds (one signature moment).
- **Fits:** brand/campaign microsites, creative tools, music/culture. **Kills:**
  dashboards, forms, anything trust-critical.
- **Calibration:** award microsites (tastefully), Emil Kowalski's kinetic demos.

---

## After you choose

1. Write the direction's **tokens first** (invoke `design-tokens`) — the type
   scale ratio, palette, spacing, radius, shadow, and `motion.ts` all follow from
   the choice above.
2. Draw components from the registries that match the register (see
   [`registry-map.md`](registry-map.md)) — restrained clusters for 1/2/4, and at
   most **one** effect-maximalist piece for 3/5.
3. Never blend two directions in one surface. A page that is half editorial and
   half brutalist reads as indecision — which is just a fancier slop.
