---
name: maya-record
description: Write a settled decision or a sourced research finding for the Maya dates project into docs/decisions or docs/research as a numbered, citable markdown file. Use when reasoning should outlive the conversation.
---

# Record a decision or a finding

Two kinds of durable document, both in the hub repo. Picking the wrong one is the most common mistake here.

- **Decision** — `docs/decisions/NNNN-kebab-title.md`. A choice that constrains the code, made by Drew: which correlation constant is the default, how Calendar Round arithmetic rounds, which library owns Long Count parsing. Reversible only by a later decision that supersedes it.
- **Finding** — `docs/research/<topic>.md`. Something established from a source: a published Long Count ↔ Gregorian pair, a convention in the epigraphic literature, a disagreement between authors. Facts about the world, not choices about the code.

If it is genuinely both — "the literature says X, so we do Y" — write the finding first, then a decision that cites it.

## Decision format

Nygard-style ADR. Do not add sections.

```
# NNNN. <Title stated as the decision>

- Status: accepted            # proposed | accepted | superseded by NNNN
- Date: YYYY-MM-DD

## Context

What forced the choice, including the constraint that made the obvious option wrong.

## Decision

One paragraph, present tense, active voice. "We default to the GMT correlation at 584283."

## Consequences

What this makes easy, what it makes hard, and what now has to hold elsewhere in the code.
```

Numbering: `ls docs/decisions/`, take the next integer, zero-pad to 4. Never reuse or renumber.

## Finding format

```
# <Topic>

## <Claim>

<The claim, stated precisely.>

Source: <Author, Year, work, page or table number>
Checked: YYYY-MM-DD
```

Every claim carries a source. A citation is author, year, and where in the work — "Coe" is not a citation; "Coe 2011, Table 2" is. If Drew states something from memory, write it and mark `Source: unverified — stated from memory` rather than inventing a reference. Never attribute a claim to a work you have not seen.

## Workflow

1. Confirm the hub repo and that the target directory exists; create it with a one-line README if not.
2. Draft the file and show it to Drew before committing.
3. Commit as `docs: <title>`. Reference the issue or PR that prompted it in the commit body.
4. If this supersedes an earlier decision, edit that file's Status to `superseded by NNNN` in the same commit.

## Rules

- One decision per file. A draft containing two decisions gets split.
- Record what was decided, not the deliberation. Options considered belong in Context only where they explain the constraint.
- Never write a decision for something still open. Open questions go in `docs/STATE.md`.
- Do not soften a consequence because it is inconvenient. The file exists so future-Drew can tell whether the decision still holds.
- Anything intended to be readable by an academic collaborator is written to that standard the first time: precise claims, real citations, no hedging filler.
