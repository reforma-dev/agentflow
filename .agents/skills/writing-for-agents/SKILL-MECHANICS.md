# Skill mechanics

Skill-specific branch of [writing-for-agents](SKILL.md): frontmatter and invocation. Writing quality lives in `SKILL.md`.

Project skills live in `.agents/skills/<name>/SKILL.md`. Do not put project skills in `~/.cursor/skills-cursor/`.

## Invocation

- **Model-invoked** — has a `description` the agent can fire on its own, and other skills can reach it. Omit `disable-model-invocation`. The description is an always-loaded pointer: trigger branches and symptoms only — no workflow summary (agents follow the description and skip the body), no identity the body already carries. Use when the agent must notice the task (`tdd`, `plan`).
- **User-invoked** — `disable-model-invocation: true`. Only the human typing the name can start it. Description is a one-line human summary; strip trigger lists. Use when firing unsolicited would be noise (`grill`, `handoff`).

Pick model-invocation only when autonomous reach is worth the context load.

Always-on playbooks are not skills — put them in always-on rules (loaded every turn).

## Frontmatter

```yaml
---
name: skill-name
description: >-
  Use when <trigger branches>.
---
```

`name`: lowercase, hyphens, max 64 chars. `description`: third person, max 1024 chars. Model-invoked: WHEN only (triggers / symptoms). User-invoked: one-line WHAT.

## Disclosure

Essential steps in `SKILL.md`. Detailed reference in a sibling file one level down, linked from `SKILL.md`. No nested trees of docs.

Do not add `agents/` YAML sidecars unless a tool in this repo actually reads them.
