---
name: code-review
description: >-
  Use when a PR-sized slice is complete and needs review before commit, or when
  the diff may reinvent APIs, add wrappers, or grow without shrinking. Not for
  open-ended bug hunts.
license: MIT
---

# Code review

Review a finished slice, shrink leftover structure, and fix obvious defects.
Ask the user only when the call needs a product or design decision.

## Isolation

Run the review in **one subagent**. The parent chat keeps the brief, not the
review trail.

**Parent.** Brief the subagent, then launch it with this skill's rules:

1. **What changed** — scoped paths, or the git range to diff
2. **Why** — the slice intent (PR briefing, user request, settled constraints
   that affect this diff)

When it finishes, relay its return. Do not re-review.

**Subagent.** You were launched to review. Review, fix, and verify. Return
the two lists. Do not launch another subagent.

If this client cannot launch a subagent, review in this chat.

## Scope

Paths, symbols, or an area the user named win. A named fixed point (branch,
tag, `main`, PR) → `git diff <fixed>...HEAD` (three-dot), still honor those
paths inside it.

Otherwise: `git diff --no-color` and `git diff --cached --no-color`. No local
diff → files from this conversation. Still nothing → `git show --stat --patch
--no-color HEAD`.

Stay inside that scope except to match existing patterns. Preserve unrelated
user changes.

## Fix

You review and you fix. Follow the nearest project guide (`AGENTS.md` or
equivalent).

Preserve behavior: only **how**, not **what**. Prefer readable, explicit code
over fewer lines. Nested ternaries, dense one-liners, and mashed concerns are
not simpler. A named abstraction that earns its place is keep. A new file or
helper is wrong unless it removes more structure than it adds.

**Always check**

1. **Reuse** — search the repo for each new helper, component, or copied
   pattern. Prefer shared libraries and the same package. An existing API
   already does the job → call it. No parallel wrapper. Duplicates in scope →
   keep the better one, retarget imports, delete the rest.
2. **Smell** — pass-throughs, extra HTML/JSX, one-off barrels, muddy shape.
   Inline or delete. Do not wrap a wrapper.
3. **Orphans** — unused imports, locals, helpers, exports, files, or
   commented-out blocks **this change** made dead. Grep real uses, including
   dynamic `import()` and string path lookups. Zero uses → delete. Public
   package export without proof → ask. Pre-existing dead outside scope → leave.
4. **Problems** — a defect you already saw (broken emit, silent wrong path,
   leftover after a failed write) → fix this turn. Do not hunt bugs across the
   repo.
5. **Tests in scope** — keep real behavior tests. Delete mock-theater, dupes,
   empty, or greenwash. Do not invent tests for a prod-only change. Do not
   reshape prod to please a weak test.

**Fix vs leave**

- Local, obvious, behavior-preserving → do it.
- Needs a product call, changes the contract, or is too large to do safely →
  leave it on the decision list.
- The whole approach is wrong → explain the replacement you would ship. Do not
  nibble.

Tie-break: existing helper > inline > new helper. No edits outside scope.

## Verify

No pass / done / clean claim without a command you ran in **this** turn.
Identify the command → run it full → read exit and failures → then claim.

Use the project's test and lint for the scoped files.

A bug you fixed with no covering test → add a regression test or list
`no test: …`.

## Output

This is the whole return. Ordinary sentences.

```markdown
### Fixed

- <what you changed and why, one line each>

### Needs a decision

### <Problem>

<What's wrong and why it matters.>

<How to fix it. One obvious change → that change. A call they have to make → the real options and which you'd pick.>
```

Omit **Fixed** when you changed nothing. Omit **Needs a decision** when
nothing is left unfixed. The heading is the problem, not a category. Do not
invent problems.

A check that failed → say which command and what failed. Passed checks stay
out of the reply.

## Done

The scoped change has no leftover production structure you could remove
locally, obvious defects are fixed, verification ran this turn, and every
unfixed problem is on the decision list with how to fix it.
