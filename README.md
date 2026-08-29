# agentflow

A lean agent loop: grill → plan → one chat per PR → review → commit → handoff.

Like OpenSpec, less binding. One plan file. No proposal/design/tasks split, no archive ceremony.

Loop: [AGENTFLOW.md](AGENTFLOW.md). Skills: `.agents/skills/`.

## Skills

| Skill                | When                                      |
| -------------------- | ----------------------------------------- |
| `grill`              | Sharpen decisions before a plan           |
| `plan`               | Write the PR-sized plan                   |
| `handoff`            | Pass the baton to the next chat           |
| `code-review`        | Shrink / reuse / burn                     |
| `writing-for-agents` | Edit skills or `AGENTS.md`                |
| `research`           | Landscape note under `.scratch/research/` |
| `tdd`                | Red → green at agreed seams               |

Craft (MobX, UI, commit hooks) stays in the consuming repo.

## Reforma

Sibling checkout. From the monorepo:

```bash
./reforma sync agentflow
```

Copies `AGENTFLOW.md` and the loop skills into Reforma. Edit here, then sync. Override the source with `AGENTFLOW_DIR`.
