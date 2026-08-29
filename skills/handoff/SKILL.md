---
name: handoff
description: >-
  Save AGENTFLOW context to disk before continuing in a fresh chat.
license: MIT
disable-model-invocation: true
---

# Handoff

Use this after an implementation PR when the next slice will continue in a
fresh chat. Write a file the next chat can `@`-attach. The handoff + plan are
the durable source of truth.

Loop: the repo-root loop doc (`README.md` or `AGENTFLOW.md`).

## Steps

1. **Find the plan.** Path the user named, the last handoff, or the plan in this
   thread.
2. **This PR.** What shipped (paths, commit hash if any). Done-when met or not.
3. **Bleed.** Work that belongs to a later plan row but landed, or should have.
   Fold it into the plan: check off this PR, rewrite later rows. Do not leave
   the next chat to discover leftover files.
4. **Next PR.** Title + done-when from the updated plan. One row only.
5. **Write** `.agentflow/<slug>/handoff.md` (create dirs). Reuse the same slug
   for the feature so the next chat overwrites this file. Not OS temp.
6. **Print** the path and what the fresh chat should attach.

Redact secrets. Do not paste diffs or OpenSpec bodies — point at paths.

If the user passed a focus, that is the next chat’s Next PR.

## File

```markdown
# Handoff: <slug>

> Next chat: read this file and the plan. Implement **only** Next PR.
> Do not resurrect discarded approaches from Cursor summarize.

## Plan

path: <file the next chat can open>
sync: updated | unchanged

## This PR

<title>
done when: <criterion> — met | not met
shipped: <paths, commit if any>

## Bleed

<what leaked into / out of later PRs, and how the plan changed>
none

## Next PR

<title>
done when: <criterion>
suggested: tdd / code-review / craft skills for the next slice
```
