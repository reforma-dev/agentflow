# AgentFlow

Use this loop for changes larger than an obvious quick fix:

```text
Research → Grill → Plan → PR → Review → Commit
                          ↑                  │
                          └──── Next PR ─────┘
```

Research is optional. Small tasks can skip the plan. Write a handoff only when
the work moves to a fresh context.

## 1. Learn how it works

Explore the existing feature, code, or technology before proposing a change.
Use `/research` when the findings must survive the current chat. Save reusable
findings under `.agentflow/<feature>/research/`.

Skip this step when the area and required change are already clear.

## 2. Sharpen the task

Run `/grill`. List assumptions, unresolved decisions, what is in and out of the
task, and how the result will be checked.

Continue until no open decision can change how the work will be done. Then
proceed directly for a small task or load `/plan` for larger work.

## 3. Plan PR-sized slices

Save the plan to `.agentflow/<feature>/plan.md`.

Each row is the smallest complete, independently shippable change that does one
useful thing and has one clear way to test it. Put lower-level pieces before the
code that uses them.

Common shapes:

- Full-stack feature: behavior-preserving refactoring, then shared types and
  backend, then frontend integration.
- Frontend feature: reusable components, then shared runtime or wiring, then
  user-facing interfaces.
- Small feature: one complete vertical slice.

Give a foundation its own row when it is independently useful. Keep
feature-local components and wiring with their first consumer. Split distinct
outcomes or architectural decisions that can ship separately.

Keep the plan current as implementation changes. Record scope changes and new
decisions in the plan instead of letting the active PR grow silently.

## 4. Implement one PR

Implement the first unchecked row and nothing beyond it. Without a plan, keep
the change small enough to review as one useful result.

Load the relevant project skills. Use `/tdd` when the work should proceed
test-first.

Verify the slice using the checks named in the plan. Check its row only after
the implementation and verification are complete, then update later rows to
match what remains.

## 5. Review

Run `/code-review` against the completed slice. Fix local findings and reduce
the change when the review verdict requires it.

Read the final diff yourself after the agent review.

## 6. Commit

Commit the verified slice using the project's normal workflow. Then return to
the first unchecked row.

## 7. Refresh context when needed

Continue in the current chat while its context remains useful. When it becomes
noisy, summarize it or start a fresh chat.

Run `/handoff` before moving unfinished work to a fresh context. Save the result
to `.agentflow/<feature>/handoff.md` with what shipped, what changed, and which
PR comes next. Bring the plan and handoff into the new context, then resume from
the first unchecked row.
