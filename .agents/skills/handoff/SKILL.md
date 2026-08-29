---
name: handoff
description: >-
  Write an AGENTFLOW handoff so the next chat can continue the next PR.
disable-model-invocation: true
---

# Handoff

End of an implementation PR chat — not after grill. Write a file the
**next** chat will `@`-attach. Cursor `/summarize` is a sketch — this
file + the plan are the source of truth.

Loop: [AGENTFLOW.md](../../../AGENTFLOW.md).

## Steps

1. **Find the plan.** Path the user named, the last handoff, or the plan in this
   thread. No plan → write one from this chat’s PR list before continuing.
2. **This PR.** What shipped (paths, commit hash if any). Done-when met or not.
3. **Bleed.** Work that belongs to a later plan row but landed, or should have.
   Fold it into the plan: check off this PR, rewrite later rows. Do not leave
   the next chat to discover leftover files.
4. **Next PR.** Title + done-when from the updated plan. One row only.
5. **Write** `.scratch/handoffs/<slug>.md` (create dirs). Reuse the same slug
   for the feature so the next chat overwrites this file. Not OS temp.
6. **Print** the path and: next chat attaches this file + the plan.

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
