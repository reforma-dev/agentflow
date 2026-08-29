---
name: research
description: >-
  Landscape research into a dated note under .scratch/research/. Use when the
  user asks to research, поресерчить, gather a landscape or shortlist, compare
  competitor catalogs or marketplaces, or collect what we should add. Not for
  codebase investigation or a one-file lookup.
---

# Research

Turn an open product/market question into a **note a later chat can `@`**. Write
the file. Reply is a path plus a short takeaway — do not paste the note.

This is landscape work: catalogs, competitors, “what exists out there,” what
fits **us**. Codebase questions stay on the project's explore rules. Do not
implement. Do not grill unless the ask is two different researches.

`.scratch/` is gitignored. Notes are local train material.

## Output

Default: one file `.scratch/research/<slug>.md`.

Split into `.scratch/research/<slug>/` when the ask is **two or more independent
questions**, or a later chat would `@`-attach only one slice. Then:

- `index.md` — question, filter, waves, links to pages
- one page per slice — `@`-attachable alone

Reuse the slug if this thread continues the same topic; edit the file and bump
the date. New topic → new slug.

Write the note in the user's language.

## Steps

1. **Pin the question and the filter.** One sentence each. If the ask is already
   sharp, state them in the note — do not interview. **Done when:** a later
   reader can reject a candidate without asking you.

2. **Current state.** What we already have (catalog, product, TODO). Search the
   codebase per nearest `AGENTS.md`. Do not list an existing thing as new.
   **Done when:** the note names what is already true.

3. **Pull live sources.** Open the actual catalogs / competitor pages / docs.
   Memory is a hint; the page today is the source. Date every snapshot.
   **Done when:** each keep traces to a page you opened, not a vibe.

4. **Apply the filter.** Every keep has a **why-for-us** (user ships a working
   app, or the agent builds better). Name the rejects — the reject list is the
   other half of the note. **Done when:** nothing sits in a dump “also exists.”

5. **Waves.** Ranked next moves, not a catalog dump. Wave 1 is the smallest set
   without which the product is not the product. **Done when:** someone could
   start Wave 1 without re-reading the sources.

6. **Write, then point.** Create the dir. Print the path. Takeaway is 3–5 lines:
   the call and the Wave 1 list.

## Note shape

```markdown
# <Title>

<summary: what was asked and the call in one sentence>

Date: YYYY-MM-DD.

Already have: <current state>

---

## Filter

<the inclusion test — two questions max>

---

## <Category>

| Item     | Why        |
| -------- | ---------- |
| **Pick** | why-for-us |

Skip: <named rejects and the reason>

---

## Waves

**Wave 1 — <without this we are not the product>**

1. …
```

Tables: name + why. Bold the picks. Category headings only when the filter
splits that way. Add a dated competitor snapshot when the ask is “what they
have.”

## Quality

- Filter first. A marketplace menu is not a strategy.
- Why-for-us, not “it’s popular.”
- Rejects are named, with a reason.
- Runtime vs builder context: say which slot a pick occupies when the domain
  has both (agent-while-building vs the shipped app).
- No secrets. No implementation. No `CONTEXT.md` / ADRs.
