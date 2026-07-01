---
name: design-tokens
description: >-
  UIForge's token foundry — emits and ENFORCES a project's design signature
  before any component is built. Use at the start of any UI work, or when asked
  to set up a theme, design system, design tokens, color palette, type scale, or
  spacing/radius/shadow foundation, or to make a shadcn/Tailwind theme look
  non-default. Emits tokens.css (color roles, type scale, 8px spacing, radius,
  shadow) + motion.ts derived from the chosen design direction, then scans the
  build for off-token "magic numbers" and corrects them — so every value in the
  UI traces to one coherent source, the way v0 and Lovable produce premium output.
---

# Design Tokens — emit first, enforce always

Token-first, *enforced at generation time*, is the single mechanism most
correlated with "designed vs slop" output across every premium AI-UI tool (v0
mandates tokens; Lovable scans each generation for violations and auto-corrects;
Subframe cascades them). Do the same: **emit the signature before the first
component, then let nothing use a value that isn't in it.**

## 1. Emit `tokens.css` before any component

Derive the values from the chosen **direction** (see the `design-director`
skill's `directions.md`). Emit CSS custom properties (shadcn-compatible — set
`cssVariables: true`) so components consume `var(--…)`, never literals:

```css
:root {
  /* color — semantic ROLES, not raw hex at point of use */
  --bg: …; --fg: …;                 /* base surface + text */
  --surface: …; --on-surface: …;    /* raised card + its text */
  --muted: …; --border: …;          /* secondary text, hairlines */
  --primary: …; --on-primary: …;    /* the ONE accent + its text */
  --ring: …;                        /* focus ring, ≥3:1 */

  /* space — 8px grid (4px half-step); ONE scale */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  /* radius — one vocabulary */
  --radius-sm: …; --radius: …; --radius-lg: …;

  /* elevation — one light source, monotonic */
  --shadow-1: 0 1px 2px rgb(0 0 0 / .06);
  --shadow-2: 0 2px 6px rgb(0 0 0 / .08);
  --shadow-3: 0 8px 24px rgb(0 0 0 / .12);

  /* type — sizes from ONE ratio; role line-heights */
  --text-xs: …; --text-sm: …; --text-base: 16px; --text-lg: …;
  --text-xl: …; --text-2xl: …; --text-3xl: …; --text-display: …;
  --leading-tight: 1.1; --leading-snug: 1.25; --leading-normal: 1.5;
  --font-display: …; --font-text: …; --font-mono: …;
}
```

Fill each `…` from the three references, tuned to the direction. Add a
`.dark` / `@media (prefers-color-scheme: dark)` block that swaps the same roles.

- Color roles, palette construction, contrast, ban-purple → [`references/color.md`](references/color.md)
- Type scale, measure, pairing, non-default fonts → [`references/typography.md`](references/typography.md)
- Spacing grid, layout primitives, fluid sizing, breakpoints → [`references/space-layout.md`](references/space-layout.md)

Motion tokens (`motion.ts` — easing/duration/spring) belong to the same signature;
the **`motion`** skill owns their exact values. Emit it in the same first step.

## 2. Override the defaults (this is a real rule)

Unmodified shadcn `slate`/`zinc` + the stock `--radius` + a default font is the
#1 data-mined tell of AI-built UI. **Change all three** and add one token the
default kit doesn't ship (a signature surface, an ink accent, a distinctive
radius) and apply it consistently. `tweakcn` can generate a non-default shadcn
theme to start from.

## 3. Enforce — scan the build, correct drift

After components are in, treat the token file as law. Scan the diff and fix any
value that doesn't derive from a token:

```
# raw hex / rgb at point of use (should be var(--…))
#[0-9a-fA-F]{3,8}\b   |   rgb\(|rgba\(|hsl\(
# off-grid spacing (not a multiple of 4) in p-/m-/gap-/space- or px values
\b(p|m|gap|space)[trblxy]?-\[?\d*\.?\d+px\]?     # inspect: on the 4/8 grid?
[^-]\b(5|7|9|11|13|14|15|17|18|19|21|22|23)px\b  # common off-scale px
# arbitrary type sizes / line-heights bypassing the scale
text-\[\d+px\]   |   leading-\[\d
```

Every hit is either promoted to a token or snapped to the nearest scale step.
"No component invents its own visual properties; it selects from the tokens."

## 4. Hand back

Report the emitted tokens (the palette, the ratio + resulting sizes, the spacing
scale, radius, shadows, fonts) so the director and the other skills build on one
source of truth. If you changed a default, say which and why.
