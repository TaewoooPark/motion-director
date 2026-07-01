---
description: Judge the current UI blind (render + screenshot if possible), grep the anti-slop patterns, and run the mandatory forced-subtraction pass.
argument-hint: "[optional: path/URL or which view to critique]"
---

Run UIForge's critique on the current UI (**$ARGUMENTS** if it names a view/path,
otherwise the view you just built). Follow the `uiforge:design-director` skill's
`critique.md`. Judge it coldly, as if someone else built it — self-graders skew
positive.

## 1. See it (never verify visually from code alone)

If a browser is available — the **webapp-testing** skill or a **Playwright** MCP —
render the running app and screenshot it:

- Start/confirm the dev server; open the view at a **desktop width (~1440px)**.
- Screenshot it **twice**: normally, and with **`prefers-reduced-motion: reduce`**
  emulated.
- Critique the *images*. Confirm the static frame is already excellent and that
  **only the one intended element moves**.

If no browser is available, say so, and critique the code + rendered structure
instead — but do not claim visual verification.

## 2. Score the rubric

Walk the `critique.md` checklist across every axis — direction & intent,
typography, color, space & surface, motion, states & copy, accessibility. Each is
pass/fail; a "yes, but…" is a fail. List every fail with the fix.

## 3. Run the Gate — two tiers (this is the real check)

**Tier A — source (grep, always).** Exits non-zero on slop + token violations, so
it's a hard gate, not a vibe:

```bash
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-lint.mjs <project-dir> --strict
```

Every **BLOCKER** must be fixed (default font like Inter/system-ui, AI
purple/indigo, gradient headline, emoji-as-UI, hype copy, motion without a
reduced-motion path). Resolve or explicitly justify each **warning** (raw hex,
arbitrary values, off-grid spacing, maxed radius+shadow, gradient overuse,
slate/zinc defaults, infinite loops, missing tokens). **Re-run until it exits 0.**

**Tier B — the render (deep, whenever a browser is available).** Grep can't see
contrast, accent coverage, spacing rhythm, or layout patterns — those live only in
the rendered result. Point it at the running view from step 1 (the dev-server URL
or the built file):

```bash
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-render-audit.mjs <url|file.html> --viewport 1440x900
```

Fix every **WCAG contrast** failure it names (real a11y defects, not taste), pull
any single **accent** back under ~10% of the surface, collapse a jittery **spacing
rhythm** and a scattered **type scale** onto one system, and break up
**equal-card / centered-hero** layout tells. Re-run until the render grade is
**A/A+ and contrast fails = 0**.

**Do not report "done" while either tier fails.**

## 4. Adversarial slop detector (the real bar)

The linter catches the grep-able; this catches the *gestalt*. Run the
design-director's `references/slop-detector.md` as an **implementation-blind**
pass — ideally a subagent (Task tool) given **only the screenshots** (normal +
reduced-motion), told to *prove a machine made this*. If it returns
**AI-DETECTED**, fix every tell it cites, re-render, and re-judge until **CLEAN**.
The bar is not "0 linter blockers" — it's "an adversary with the pixels can't
prove it's AI."

## 5. Forced subtraction (mandatory)

Identify the **single least-justified** element, color, shadow, or animation and
**remove it**. Re-view; confirm the linter still exits 0. If removing it hurt,
restore it and cut the next-weakest — but something goes.

## 6. Report

Give a pass/fail verdict per axis, the grep hits and their resolution, **what you
removed**, and — if you rendered it — attach or reference the two screenshots.
Any fail → fix and re-run this whole critique before shipping.
