# @reforma/agentflow

## 1.1.2

### Patch Changes

- 33bf112: Replace AGENTFLOW.md on init and update instead of failing when a copy already exists.
- 33bf112: Bugfixes

## 1.1.1

### Patch Changes

- 9cfa7c2: Install all skills first with `--skill '*'`, then ask about AGENTFLOW.md and the
  AGENTS.md pointer.
- 9cfa7c2: Sharpen skill descriptions for model invocation and align handoff and
  code-review with the AgentFlow loop.

## 1.1.0

### Minor Changes

- 2638741: Add interactive first-time setup, delegate skill installation choices to the
  skills CLI, install a concise workflow reference for coding agents, and leave
  `.agentflow/` version control policy to each project.

### Patch Changes

- 2638741: Let `agentflow update` initialize projects that do not have AgentFlow yet.

## 1.0.0

### Major Changes

- ee821e8: AgentFlow 1.0.0

### Minor Changes

- ee821e8: Publish the first AgentFlow CLI and reusable skill collection.
