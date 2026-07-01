---
name: content
description: >-
  UIForge's microcopy layer — words are UI. Use when writing or fixing any
  interface text: headlines, subheads, button/CTA labels, empty states, error
  and loading messages, tooltips, form labels, onboarding, or marketing copy, or
  when copy feels generic, hypey, or "AI-written." Enforces outcome-driven
  labels, error/empty states that help, a hype-word blocklist, and a specificity
  test so every claim is checkable — the difference between a page that reads as
  crafted and one that reads as a template.
---

# Content — write the interface

Copy is a design surface, not filler poured in at the end. Users **scan, don't
read** (NN/g: 79% scan; rewriting marketese to objective, concise, scannable copy
tested **+124%** usability). And "words are UI" (Polaris) — labels, empty states,
and errors are where a product feels human or feels generated.

## Buttons & actions — state the outcome

- **Verb + object, ≤ 3 words, sentence case.** Never "Submit," "Click here," or
  "Learn more" in isolation. "Send invoice." "Create project." "Start free trial."
  (Intuit measured "Send invoice" vs "Submit" at **+18% CTR**.)
- **Destructive actions = Verb + Noun** ("Delete project," "Remove member") so the
  consequence is unmistakable — never a bare "Delete" / "OK."
- One **primary** action per view; secondaries are quieter in both weight and word.

## Errors — what happened + how to fix

- Say **what went wrong and what to do next**, in plain words. No blame, no codes
  as the whole message, never "An error occurred."
- **Preserve the user's input.** Point at the field. "That email's already in use —
  sign in instead?" beats "Invalid input."

## Empty & loading states — never blank

- **Empty = why it's empty + one clear next action + a hint of the payoff.** It's
  a first-run activation moment, not a dead end. "No projects yet. Create one to
  start tracking builds." + the button.
- **Loading:** skeletons over spinners; show nothing under ~300ms (a flash reads
  as a glitch); consider optimistic UI for likes/CRUD.

## Headlines & marketing — the specificity test

Every headline needs **≥ 1 checkable element**: a number, a name, a timeframe, or
a mechanism. **The test:** if the line could be pasted onto a competitor's site
unchanged, it's a slogan — rewrite it.

- "Ship faster" → "Deploy in under 90 seconds."
- "Powerful analytics" → "Query 10B events without a data team."
- Lead with the user's problem, not your product's adjectives (inverted pyramid —
  front-load the point).

## The hype blocklist (ban these)

Marketese *lowers* measured usability and is the copy signature of AI output.
Blocklist and replace:

| Banned | Replace with |
|---|---|
| unlock / supercharge / elevate / revolutionize / streamline | the literal outcome + a number |
| seamless / seamlessly integrate | "connects to Slack, GitHub, Jira in two clicks" |
| world-class / enterprise-grade / game-changing / cutting-edge | a specific proof |
| "Trusted by thousands" | "Trusted by 4,200 engineering teams" |
| "In today's fast-paced world…" | delete; open on the user's problem |
| exclamation overuse, em-dash overuse | one clean statement |

## Voice & mechanics

- **One voice; tone flexes** to the user's state (playful on success, plain and
  calm on errors).
- Write for a **~9th-grade reading level**; sentences **< 25 words**; active
  voice; concrete over abstract.
- **Placeholders are not labels** (they vanish on focus and fail a11y) — every
  field gets a visible label; every icon gets a text label / `aria-label`.
- Numbers use `tabular-nums`; real currency/units; consistent capitalization
  (pick sentence case for UI and hold it).

Hand back copy the other skills can drop in verbatim — and flag any claim you
couldn't make specific, so it gets a real proof point or gets cut.
