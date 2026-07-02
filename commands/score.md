---
description: Grade any UI project A–F for slop — a standalone review tool. Runs the UIForge linter and reports a letter grade + the tells, for the current project, a directory, or a PR.
argument-hint: "[dir, or a PR number / URL to review]"
allowed-tools: Read, Bash(node:*), Bash(gh:*), Bash(git:*), Bash(ls:*)
---

Score the UI in **$ARGUMENTS** (default: the current project) for slop and report
a grade. This is UIForge as a **reviewer**, not a generator.

## Local directory / current project

```bash
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-score.mjs <dir>
```

It prints a letter grade on one coherent 0–100 scale (a BLOCKER is heavy — a
single one caps the grade at **C**; 0 tells → **A+**; an empty/non-standard scan →
**N/A**, never a fake A+), plus the top tells. Then summarize: the grade, the
blockers (each with the one-line why + a fix), and the two or three
highest-leverage changes to raise it.

## A pull request

If `$ARGUMENTS` is a PR number or GitHub URL, check it out and score the change:

```bash
gh pr checkout <pr>          # or: git fetch origin pull/<pr>/head && git checkout FETCH_HEAD
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-score.mjs .
```

Post the grade + the specific tells as review feedback (optionally
`gh pr comment <pr> --body …`). Frame each finding as "tell → fix", not a nitpick.

## A live URL

You have no source, but you have the render — so use the **deep tier**. Grade the
rendered page on real craft metrics (WCAG contrast per text node, accent
surface-area, spacing rhythm, type-scale coherence, AI layout patterns):

```bash
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-render-audit.mjs <url> --viewport 1440x900
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-attention.mjs   <url> --viewport 1440x900
```

The render audit grades the craft; **attention** predicts the gaze order and flags a
flat hierarchy (add `--overlay shot.png` to attach the annotated punch list). Then
render + screenshot it (webapp-testing / Playwright) and run the adversarial
[`slop-detector`](${CLAUDE_PLUGIN_ROOT}/skills/design-director/references/slop-detector.md)
on the pixels: the render-audit gives the objective numbers (a 2.9:1 contrast is a
fact), the detector gives the gestalt — "could an adversary prove it's AI." Report
both, with the tells.

Keep it useful and specific: a grade nobody can act on is noise.
