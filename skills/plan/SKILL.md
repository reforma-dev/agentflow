---
name: plan
description: >-
  Use when the user asks to write or update an implementation plan split into
  PR-sized slices after decisions are settled. Not the interview (grill) and
  not the end-of-PR baton (handoff).
license: MIT
---

# Plan

Write **one** plan that another developer or agent can pick up. Do not implement. Do not write a handoff.

If important decisions are still open, load `grill` first. Resume the plan after
the user confirms the final reading. One-line or obvious scope can skip the
plan.

## Where

- **Plan mode:** plan artifact / reply only. No `.agentflow/` files.
- **Agent mode:** `.agentflow/<slug>/plan.md` (kebab-case from the feature; reuse the slug). Print the path.
- Another machine or person: OpenSpec or a `*.md` on the branch.

## Shape

```markdown
# <Feature>

> Keep this plan current during implementation.
> Check a PR only after its done-when and verification pass.
> Record scope changes before leaving the PR.

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

Each row is the smallest complete, independently shippable change with one
coherent outcome and one verification story. Order rows from foundations to
their consumers.

## Slicing

Common shapes:

- **Full-stack feature:** behavior-preserving refactoring, then shared types and
  backend, then frontend integration.
- **Frontend feature:** reusable components, then shared runtime or wiring, then
  user-facing interfaces.
- **Small feature:** one complete vertical slice.

Give a foundation its own row when it is independently useful. Keep
feature-local components and wiring with their first consumer. Split distinct
outcomes or architectural decisions that can ship separately.

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
4. Another developer or agent can open the file and ship PR 1 without this conversation.
5. Every row leaves the repository working and does not need the next row to
   justify its code.

## Output

Print the path. The implementer starts with the first unchecked row, in this context or a new one.
