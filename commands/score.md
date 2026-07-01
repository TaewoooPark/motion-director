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

It prints a letter grade (A+…F — any BLOCKER = F), a 0–100, and the top tells.
Then summarize: the grade, the blockers (each with the one-line why + a fix), and
the two or three highest-leverage changes to raise it.

## A pull request

If `$ARGUMENTS` is a PR number or GitHub URL, check it out and score the change:

```bash
gh pr checkout <pr>          # or: git fetch origin pull/<pr>/head && git checkout FETCH_HEAD
node ${CLAUDE_PLUGIN_ROOT}/tools/uiforge-score.mjs .
```

Post the grade + the specific tells as review feedback (optionally
`gh pr comment <pr> --body …`). Frame each finding as "tell → fix", not a nitpick.

## A live URL

If given a URL, render + screenshot it (webapp-testing / Playwright), then run the
adversarial [`slop-detector`](../skills/design-director/references/slop-detector.md)
on the screenshot — the linter needs source, the detector needs only pixels. Report
whether an adversary could prove it's AI, with the tells.

Keep it useful and specific: a grade nobody can act on is noise.
