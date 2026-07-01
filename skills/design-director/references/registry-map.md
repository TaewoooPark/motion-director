# Registry map — source, don't invent

Components come from the **registry**, never from your imagination. Installing
vetted, accessible source (a) inherits correctness for free (Radix/ARIA
behavior), (b) stops you re-authoring slightly-different snippets, and (c) gives
every part **provenance** you can audit. v0 defaults to shadcn for exactly this
reason: "to prevent the model from repeatedly authoring similar components with
slight variations."

**Install** via the bundled shadcn MCP (browse/search/install in natural
language) or the CLI:
`npx shadcn@latest add "@namespace/name"` — verify props after (registries are
beta and move). Run `/uiforge:setup` to ensure a project's `components.json`
carries the registries you need.

## The taste map (this is the point)

The ecosystem's center of gravity is **effect-maximalist** — libraries that sell
"200 animated blocks, use them all." That is the slop generator. Bias hard toward
the **restrained** cluster; treat the maximalist cluster as a spice rack, not a
meal.

**Reference-grade — compose freely (fits Editorial / Precise / Warm):**

| Library | What it's for | shadcn |
|---|---|---|
| **shadcn/ui** | the un-library: unstyled, accessible primitives (Radix + Tailwind) — the neutral baseline | it *is* the convention |
| **Origin UI** | hundreds of clean, functional components; "shadcn but more" | Y |
| **Park UI** | Ark UI + Panda; headless-primitive discipline, design-system oriented | own CLI (Ark/Panda) |
| **tailark** | production marketing **blocks** (hero/pricing/features/FAQ), restrained | Y |
| **Kibo UI / Indie UI** | curated, functional additions surfaced via awesome-shadcn | Y |
| **Motion-Primitives** | ~33 motion primitives — unopinionated; taste = the restraint you apply (that's the `motion` skill's job) | Y |

**Theme tooling (use before components):**

| Tool | Use |
|---|---|
| **tweakcn** | visual theme generator for shadcn — **generate a non-default theme** (override the stock neutral/radius/font, tell #18 of anti-slop) and export tokens | feeds `design-tokens` |
| **21st.dev** | curated marketplace + "Magic MCP"; tagline *"Crafted components, not AI slop"* — quality-positioned but open-contribution (variance) | index/MCP |

**Effect-maximalist — quarantine (borrow at most ONE signature piece; fits
Brutalist / Maximalist only):**

Aceternity UI · Magic UI · reactbits · Eldora UI · Animate UI · Hover.dev ·
Skiper (Cult UI / Kokonut sit in the middle). These ship aurora, beams, meteors,
glowing gradients, 3D tilt, confetti, morphing text. Individually impressive;
put three on one page and you have the exact "AI-built" look. If a brief calls
for one, install **one** as *the* signature moment — never a page of them.

## The rules

1. **From the restrained cluster:** compose freely; these extend shadcn's
   restraint rather than piling on effects.
2. **From the maximalist cluster:** exactly **one** piece per project, and only as
   the signature — then everything around it stays disciplined.
3. **Match the register:** Editorial/Precise/Warm → restrained cluster only.
   Brutalist/Maximalist → restrained base + one maximalist signature.
4. **Provenance always:** installed from a named `@namespace`, props verified, no
   hand-authored component source. `registryDependencies` should show what pulled
   from where.

## Discovery

The living index is **registry.directory** and **awesome-shadcn-ui**
(birobirobiro) — but read them through this taste map, not as a menu. More parts
is not more design; the right *one* part, disciplined, is.
