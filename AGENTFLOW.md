# Agent Flow

How we ship a feature with agents. Git is the project's git doc (`GITFLOW.md` if it has one). Craft is [AGENTS.md](AGENTS.md). This file is the loop.

**One feature → a PR-sized plan → one chat per PR.** Do not implement the whole plan in one session.

Skills live in `.agents/skills/<name>/`. Invoke by name (`/grill`, `/plan`, `/handoff`, …).

A one-line fix skips Grill and the plan: implement → `/code-review` if it grew → `/commit`.

## The loop

1. Sharpen the idea with Grill
2. Slice the work into PRs
3. Implement one PR
4. Agent review
5. Your review, then commit
6. Pass the baton

After step 2, repeat steps 3–6 until the plan is checked off.

---

## Step 1. Sharpen the idea with Grill

Skill: `/grill`. Same chat as step 2.

Decisions, not code. Interview until the frontier is empty — shared understanding, every branch resolved.

**Done when:** every open decision is settled, or named as a blocker. Then `/plan` — same chat.

---

## Step 2. Slice the work into PRs

Skill: `/plan`. Same chat after Grill.

One file. No handoff here. Sync the plan when later PRs ship.

The plan is the source of truth. Cursor `/summarize` is not.

**Done when:** the next chat can open the plan, see which PR to implement, and know how it will know it's done.

---

## Step 3. Implement one PR

New chat. Attach the plan (and the latest handoff if a previous PR already shipped). First move: read those.

### Scope

Implement **only this PR** — the first unchecked plan row. Direct unless the slice is test-first (`/tdd`).

### UI

If `AGENTS.md` names UI craft skills, load them while building. Ask the user to check small UI edits. Live click-through when they report a flow is broken.

### Bleed

If the slice spills into a later row: record **Bleed**, edit the plan (shrink that later PR or split a new row). Do not silently finish the next PR “while we’re here.”

### Craft

Load craft skills named in `AGENTS.md` when the slice is that. Editing skills or `AGENTS.md` → `writing-for-agents`.

**Done when:** this PR’s done-when is met, and any bleed is already in the plan.

---

## Step 4. Agent review

Skill: `/code-review`. Verdict: keep / shrink / burn. The agent applies local shrinks.

**Done when:** the review has run and shrinks are applied.

---

## Step 5. Your review, then commit

You read the diff. Then `/commit`. Do not commit before both reviews.

`/commit` is the project's git slice. Branch names and PR shape stay in the project's git doc.

**Done when:** you have read the diff and `/commit` has run.

---

## Step 6. Pass the baton

Skill: `/handoff`. Writes `.scratch/handoffs/<slug>.md` and prints the path — attach that file in the next chat.

What this PR did, what bled into later PRs, next PR. Sync the plan when bleed happened.

End the chat with `/handoff` even if you will open the next chat yourself.

The next agent treats the handoff + plan as authority. It does not resurrect discarded approaches from an injected summary.

**Done when:** the file exists, the path is printed, and the plan matches what shipped.

Then: new chat, attach handoff + plan, go to Step 3.
