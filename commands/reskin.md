---
description: Extract a design signature (palette, type feel, spacing rhythm, radius) from a reference image or site, and write it into tokens — "steal this vibe" as tokens, not pixels.
argument-hint: "[path to a reference image, or a URL to screenshot]"
---

Turn the reference in **$ARGUMENTS** into a UIForge token signature. The point is
to escape the model's median prior by pinning the build to a concrete target —
not to copy the layout. Extract *parameters*, not assets.

## 1. Get the reference in front of you

- If `$ARGUMENTS` is an **image path**, read it directly.
- If it's a **URL**, screenshot it first with the webapp-testing skill or a
  Playwright MCP (desktop width), then read the screenshot.
- If nothing is given, ask the user for a reference (an image, a URL, or the name
  of a site whose feel they want).

## 2. Extract the DNA (look, then quantify)

From the reference, read off and write down concrete values:

- **Palette:** the background, the primary text, the ONE dominant accent, and a
  surface/border step — as hex. Note whether it's light or dark, warm or cool.
  (One accent only; if the reference is busy, pick the single load-bearing color.)
- **Type:** serif vs grotesk vs mono; tight vs airy; the display-to-body size
  jump; weight contrast. Map it to a real, non-default face (see
  `tools/kits/README.md` — never Inter/system-ui).
- **Space & shape:** the rhythm (dense vs generous), the corner radius (sharp /
  soft / pill), and whether elevation is shadow-based or border/flat.
- **Motion feel:** snappy/mechanical, soft/springy, or near-static.

## 3. Write it into tokens

Start from the nearest kit in `tools/kits/` and overwrite its roles with the
extracted values — producing a `tokens.css` whose palette, font, radius, and
scale match the reference. Then hand off to the `design-tokens` skill to finish
(dark mode, reduced-motion) and build on it.

## 4. Verify

Run `node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-lint.mjs . --strict` — the extracted
tokens should pass (real font, one accent, on-grid, no purple-default). Report the
palette + face you extracted and which kit you based it on. Adaptation, not
pixel-copying — and never lift the reference's actual assets or copy.
