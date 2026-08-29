---
name: writing-for-agents
description: >-
  Use when creating or editing skills, AGENTS.md, CLAUDE.md, or any doc
  an agent reaches by a pointer.
---

# Writing for Agents

Reference for any document an agent consumes. Packaging differs; the writing does not.

When the document is a skill, also read [SKILL-MECHANICS.md](SKILL-MECHANICS.md).

Root `AGENTS.md` still binds: minimum words, positive "what we will do", no discarded-alternatives archaeology unless it is a lasting must-not.

## Context pointers

A **pointer** names out-of-context material and the condition for reaching it. A skill `description` is one; a line in `AGENTS.md` naming a doc is the same object. The pointer's _wording_ decides when the agent loads the target.

- Front-load the leading word — the pointer is where triggering happens.
- One trigger per genuine branch. Synonyms that rename one branch are duplication.
- Cut identity the body already carries.
- A model-invoked `description` answers “should I load this?” — triggers and symptoms. Do not summarize the workflow; agents follow the description and skip the body.

A must-have target behind a weak pointer is a variance bug: sharpen the wording first. Inline only if sharpening fails.

## Two loads

- **Context load** — always-on material (AGENTS.md line, skill description). Pays every turn.
- **Cognitive load** — the human remembering which docs exist. Spend it where human judgement matters.

Material reached only through a pointer escapes context load. Material with no pointer rides entirely on the human.

## Information hierarchy

Two content types: **steps** (ordered actions) and **reference** (rules consulted on demand).

1. **In-file step** — what the agent does, in order.
2. **In-file reference** — consulted on demand.
3. **Disclosed reference** — sibling file, loaded when the pointer fires.

Push too little down and the top bloats; push too much and you hide what every run needs. Branching is the cleanest test: inline what every branch needs, disclose what only some branches reach.

**Co-location:** keep a concept's definition, rules, and caveats under one heading.

**Sprawl** is a document that is simply too long. Cure: disclose reference, split by branch.

Keep `SKILL.md` bodies well under 500 lines. Prefer far shorter. Match the length of this repo's existing skills.

## Steps and completion criteria

Every step ends on a **completion criterion** the agent can check.

- **Clarity** — done vs not-done is observable. "Understanding reached" invites premature completion. Sharpen the bound before splitting the sequence.
- **Demand** — "every modified model accounted for" forces work; "produce a change list" does not.

The strongest criteria are checkable and exhaustive.

## Leading words

A **leading word** is a compact concept the model already knows (_seam_, _tight_, _red_, _tracer bullet_). Repeat the token, not a restated sentence. Coin a word only if you define it once and then use it.

Prompt the **positive** target ("write one-line comments"). Negation ("don't write essays") drags the forbidden behaviour into context. A prohibition earns a place only as a hard guardrail you cannot phrase positively — then pair it with the positive target.

**Form matches the failure.** Name the failure, then pick the form.

| Failure                           | Form                                   |
| --------------------------------- | -------------------------------------- |
| Skips a known rule under pressure | Hard guardrail + the positive target   |
| Output has the wrong shape        | Recipe: the parts, in order            |
| Omits a required slot             | Field on the template they fill        |
| Behavior depends on a condition   | Conditional on an observable predicate |

A prohibition that shapes output ("don't restate") backfires — write the recipe. "Don't X unless it matters" reopens the negotiation; a real exception is its own conditional.

## Pruning

- One meaning, one source of truth. Duplication inflates rank and goes stale.
- The **environment** is a source of truth (`package.json` scripts, `--help`, directory layout). Don't cache a lookup the agent can do. Cache the unwritten convention, the reason, the gotcha no config confesses.
- Delete **no-ops**: instructions the model already obeys. The test is "does this change behaviour vs the default?", not "would a human find it nice".
- Relevance: if a line never fires on the task, or the world moved on, delete the whole sentence.

## Placement

| Doc                | Where                                              | Load                                 |
| ------------------ | -------------------------------------------------- | ------------------------------------ |
| Always-on craft    | root / package `AGENTS.md`                         | context — keep brutal                |
| Triggered workflow | `.agents/skills/<name>/SKILL.md`                   | pointer in `description`             |
| Area gotcha        | nearest `AGENTS.md`, not a new global `CONTEXT.md` | context for that area                |
| Spec for a change  | wherever the project keeps it                      | pointer from the task, not AGENTS.md |

Do not add a repo-root `CONTEXT.md` or ADR tree for agent vocabulary. Domain language lives in the `AGENTS.md` that owns the code.
