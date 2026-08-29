---
name: grill
description: Relentless interview to sharpen a plan or design until every branch is resolved.
disable-model-invocation: true
---

# Grill

Interview until you reach a shared understanding. Map the work as a **design tree**: every decision branches into the decisions that hang off it.

Use this for non-trivial product/architecture calls. Do not grill a one-line fix.

Do **not** create `CONTEXT.md`, ADRs, or tickets as you go. Capture settled decisions in the reply; if a lasting convention belongs in an `AGENTS.md`, say so and wait for the user to ask you to write it.

## Rounds

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait.

```
❓ **Q1** - **<title>**: <body, including choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<title>**: <body>

➡️ <your recommended answer>
```

Each round of answers reshapes the tree. Recompute the frontier. A question that depends on another still open in this round belongs to a _later_ round.

## Facts vs decisions

Finding _facts_ is your job. When a frontier question needs something from the repo, look it up (nearest `AGENTS.md`) — don't ask the user for anything you can read. A running lookup is an unsettled prerequisite: ask the rest of the frontier now.

The _decisions_ are the user's. Put each to them and wait.

Push back when a simpler approach fits. Name blockers instead of designing around them. Recommend the project's default (nearest `AGENTS.md`: surgical, inline, no new files) unless the user has a reason not to.

## Done

The frontier is empty: every branch visited, nothing silently assumed. Do not implement.

Then write the plan — load `plan`. One file. No handoff.
