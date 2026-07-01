# Color — roles, not hex

The amateur move is picking hexes at the point of use. The system move is
defining **semantic roles** once, so contrast and coherence are structural.

## Semantic roles (define these, use only these)

Pair every foreground with the surface it sits on, so a legible combination is
guaranteed by construction:

- `--bg` / `--fg` — page surface + its text
- `--surface` / `--on-surface` — a raised card + its text
- `--muted` — secondary text (a lower-contrast `--fg`, still ≥ 4.5:1 if it's real text)
- `--border` — hairlines (a subtle step, ~3:1 against `--bg`)
- `--primary` / `--on-primary` — the **one** accent + text that sits on it
- `--ring` — focus indicator, ≥ 3:1 against adjacent colors

This mirrors **Radix Colors'** 12-step semantics (1–2 backgrounds · 3–5 component
backgrounds normal/hover/active · 6–8 borders subtle/ui/focus · 9–10 solid +
hover · 11 muted text · 12 high-contrast text) and **Material's** `role` / `on-role`
pairing. If you need a full ramp, generate **50–950** per hue (base at 500),
stepped **perceptually** (OKLCH), not by linear math.

## Building the palette (4–6 tokens is plenty)

1. **One dominant near-neutral base** + **one** sharp accent beats an evenly
   distributed rainbow. The accent lands on < 10% of the surface.
2. **Tint the neutrals.** Pure `#6b7280` grey is a tell; nudge greys slightly
   toward the brand hue (or warm them). Editorial warmth: a **paper** base like
   `#F9F7F3` instead of `#ffffff`.
3. **8–10 shades per hue** if you're building a real ramp; reason in HSL/OKLCH,
   keep saturation intentional (bump saturation as lightness drops so mid-tones
   don't go muddy).

## Hard rules

- **Never grey text on a colored background.** Instead pick a text color in the
  **same hue**, shifted in lightness/saturation (or lower a white text's opacity).
- **WCAG floor, not goal:** body **≥ 4.5:1**, large (≥18pt/14pt-bold) & UI &
  focus-ring **≥ 3:1**; aim 7:1 for body where you can. Check every text/bg pair.
- **No purple/indigo→violet gradient hero on white.** It is the single most-cited
  AI tell. A gradient may exist only as a *deliberate* signature in Maximalist,
  and never the default `from-purple-* to-blue-*`.
- **Override shadcn's default `slate`/`zinc`.** Choose your own neutral and accent.

## Dark mode

Swap the same **roles** in a `.dark` block (or `@media (prefers-color-scheme:
dark)`); don't re-pick colors ad hoc. Dark backgrounds use the **950/900** end;
keep the accent's perceived brightness balanced (often a slightly lighter accent
in dark). Verify contrast again — it changes.
