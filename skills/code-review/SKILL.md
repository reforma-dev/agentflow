---
name: code-review
description: >-
  Use when a PR-sized slice is complete and needs review before commit, or when
  the diff may reinvent APIs, add wrappers, or grow without shrinking. Not for
  open-ended bug hunts.
license: MIT
---

# Code review

Reviewers collect; **you apply fixes** — including obvious local defects, without asking. Done when **no unnecessary production structure remains**, calling what already exists. Verdict: `keep` / `shrink` / `burn`.

Bugs are incidental: whoever already read the files reports ones they saw. Do not launch a bot to hunt bugs.

## Scope

User-named paths / symbols / area win. Named fixed point (branch, tag, `main`, PR) → `git diff <fixed>...HEAD` (three-dot), still honor a path allowlist inside it.

Otherwise: `git diff --no-color` and `git diff --cached --no-color`. No local diff → conversation files. Still nothing → `git show --stat --patch --no-color HEAD`.

Do not broaden past that scope except to match existing patterns. Preserve unrelated user changes.

**Allowlist** = those files. Every bot and every edit stays inside it (imports from an allowlisted file are ok).

## 1. Triage

Read the allowlisted diff. Write **one** launch line, then collect or skip to fix.

| Launch line             | When                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `parent-only`           | Default. The whole diff fits in one read.                                                           |
| `one: <bot> — <reason>` | One row matches **and** the parent cannot finish the verdict from this read. Reason names that gap. |
| `army: <bots>`          | User said full / strict / army. One wave of matching rows except bugbot.                            |
| named bots              | User named them. Those names only. Includes `bugbot` if they said it.                               |

**One-bot pick** (not army, not named): first match only.

1. **reuse** — may have reinvented or wrapped something that already exists, **and** that existing API is not obvious from this read (outside the allowlist, or too many files to hunt). A new file on a small diff is not enough.
2. **smell** — roughly ≥4 production files and wrappers / pass-throughs / muddy shape; reuse did not match.
3. **security** — actual trust surface (auth, secrets, injection, user input, sandbox, network); reuse and smell did not match.

No match → `parent-only`. A `.ts` file, “several files”, or “tests in the allowlist” is not a launch.

| Bot      | Type              | Launch                                     |
| -------- | ----------------- | ------------------------------------------ |
| Reuse    | `reuse-review`    | Pick 1, army if that row matches, or named |
| Smells   | `smell-review`    | Pick 2, army if that row matches, or named |
| Security | `security-review` | Pick 3, army if that row matches, or named |
| Bugbot   | `bugbot`          | User named `bugbot` only                   |

Parent always does reuse / wrappers / verdict itself (nearest `AGENTS.md`; React / MobX / copy / tests → matching craft skill). A bot is extra eyes, not a replacement.

## 2. Collect

`parent-only` → skip this step.

Launch **only** the bots on the launch line. Army: one parallel wave. Otherwise exactly one. They must not edit. `run_in_background: false`, no `resume`.

**Brief** (every bot, plus the allowlist):

```text
Primary: reuse (existing APIs vs new wrappers), architecture, cleanliness.
Verdict required: keep | shrink | burn — one line, why.
Incidental: bugs you already saw while reading. Do not hunt bugs.
```

**Reuse / smells** — `description` exactly `Reuse Review` / `Smell Review`. They inspect git. Prompt: allowlist + brief.

**Security / bugbot** — `description` exactly `Security Review` / `Bugbot`. They compute the diff. Prompt:

```text
Full Repository Path: <workspace root>
Diff: uncommitted changes
Custom Instructions: Review ONLY these files (ignore other uncommitted changes):
- <allowlist path>

Primary: reuse (existing APIs vs new wrappers), architecture, cleanliness.
Verdict required: keep | shrink | burn — one line, why.
Incidental: bugs you already saw while reading. Do not hunt bugs.
```

Empty diff on committed HEAD/branch work → retry once with `Diff: branch changes`. Bugbot still empty → retry once with `Diff: natural language` and a per-file Change Description. Wrong prompt: retry once, then stop that bot and say so.

**Spec (you):** user-passed path, or issue/PR in commit messages (Linear, GitHub), or the plan in this conversation. Do not hunt a specs tree the user did not name. Missing/partial/scope-creep → findings for Fix. No source → skip.

## 3. Fix

Normalize: `severity | confidence | file:line | finding | fix`. Drop `confidence: low`. Dedup.

Bar (even if a bot under-reported):

1. **Reuse** — existing helper/component/API does the job → call it. No parallel wrapper. Duplicate implementations in the allowlist → keep the better one, retarget imports, delete the rest.
2. **Wrappers** — pass-throughs, extra HTML/JSX, one-off barrels/helpers: inline or delete. Do not wrap a wrapper.
3. **Shrink** — no unnecessary production structure remains. Delete wrappers, dupes, and orphans — not by packing lines. Nested ternaries, dense one-liners, and mashed concerns are not shrink. Clarity wins when they conflict. Preserve behavior: only how, not what. Net-fewer prod lines (tests excluded) is a strong signal leftover structure remains, not required proof. A named abstraction that earns its place is keep. A new file/helper is wrong unless it removes more structure than it adds.
4. **Orphans** — unused imports, locals, helpers, exports, files, or commented-out blocks **this allowlisted change** made dead. Before delete: Grep real uses, including dynamic `import()` / string path lookups. Zero uses → delete. Package public export / cross-app API without monorepo Grep proof → defer. Pre-existing dead outside the allowlist → leave. Unsure → defer (no knip/depcheck/ts-prune sweeps).
5. **Verdict** — local `burn`/`shrink` (inline, delete the new file, call the existing API) → do it. Whole-shape `burn` → say so and defer; do not nibble.
6. **Tests in the allowlist** — keep real behavior tests; delete mock-theater / dupes / empty / greenwash. Do not invent tests for a prod-only change. Do not reshape prod to please a weak test.
7. **Obvious** — a named local defect (broken emit, silent wrong path, leftover after a failed write) → fix this turn. Do not ask.

Incidental bugs: fix if local; else defer. Do not hunt.

Default-accept reuse/smell findings that serve the bar when the fix is local. Skip only with `needs product call` / `this is the contract` / `too large`.

Tie-break: existing helper > inline > new helper. You fix — do not delegate. No edits outside the allowlist. No re-hunt. Small in-scope shrink → do it; larger → defer. Do not rerun collectors unless a fix likely created a new bug.

## 4. Verify

No pass / done / clean claim without a command you ran in **this** turn. Identify the command → run it full → read exit and failures → then claim. A previous run, “should pass”, or lint-for-compile is not evidence.

Targeted: the project's test and lint for the allowlist (nearest `AGENTS.md`).

Bug you fixed with no covering test → add a regression test or list `no test: …`.

## Output

Launch line; **verdict** (`keep` / `shrink` / `burn` + one line); what changed; no unnecessary prod structure remains; wrappers gone / APIs reused; orphans deleted or deferred (Grep gap / public API); incidental bugs fixed or deferred; tests judged or `no tests in allowlist`; spec gaps or `no spec`; deferred (`severity | file:line | reason`); tests/lint **this turn** (command + exit). No “fix or skip?” for local findings.
