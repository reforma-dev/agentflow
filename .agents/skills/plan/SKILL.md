---
name: plan
description: >-
  Use when writing or updating a PR-sized implementation plan after
  decisions are settled, before implementation. Not the interview
  (grill) and not the end-of-PR baton (handoff).
---

# Plan

Write **one** PR-sized plan the next chat can `@`. Do not implement. Do not write a handoff.

Open decisions → stop and run `grill`. One-line / obvious scope → skip this skill.

## Where

- **Plan mode:** plan artifact / reply only. No `.scratch/` files.
- **Agent mode:** `.scratch/plans/<slug>.md` (kebab-case from the feature; reuse the slug). Print the path.
- Another machine or person: OpenSpec or a `*.md` on the branch.

## Shape

```markdown
# <Feature>

**Goal:** one sentence
**Approach:** 2–3 sentences — the chosen reading
**Reuse:** existing APIs this plan calls (`path`)

## Files

- `path` — what changes (or `create`)

- [ ] PR 1 — <title>
      done when: <observable>
      verify: <command>

- [ ] PR 2 — …
```

Each row is one independently shippable change. Ordered.

## Rules

- Ground every row in files you read. Cite a path → it exists, or mark `create`.
- One approach. No menu, no TBD, no “handle edge cases”, no “similar to PR n”.
- File map before rows. Reuse before create.
- Tight: settled model + rows. Cut prose, keep paths.
- `done when` is observable. `verify` is the command the implementer runs.

## Self-check

1. Every settled decision has a row or is named out of scope.
2. Every path exists or is marked `create`.
3. No placeholders.
4. Next chat can open the file and ship PR 1 without this conversation.

## Output

Print the path. Next chat `@` attaches this file; implement only the first unchecked row.
