# 0007. Project-wide decisions and findings live in the fixtures repository

- Status: proposed
- Date: 2026-09-13
- Depends on: 0002, 0006

## Context

0002 keeps the packages in separate repositories. That leaves an unanswered question the monorepo draft had answered by accident: where do project-wide ADRs and research findings live?

The options are all bad except one. Duplicating `docs/decisions/` across four repositories guarantees divergence. Leaving each repository to hold only its own decisions loses every cross-cutting one — 0001's four-layer architecture and 0002 itself belong to no single package. A dedicated meta-repository holding nothing but documentation is a repository nobody visits, and documentation nobody visits is documentation that goes stale.

The fixtures repository from 0006 is already the cross-cutting artifact: shared by all four packages, versioned, and intended to be citable. Research findings are the justification for the vectors it contains — a sourced claim about the Haab seating convention and the fixture that encodes it are the same fact written twice. They belong in the same place, and that place is visited every time a vector changes.

## Decision

Project-wide documentation lives in the fixtures repository alongside the data:

```
docs/decisions/    ADRs affecting more than one package
docs/research/     sourced findings, citations required
docs/product/      the PRD and non-goals
docs/plan/         work packages and waves
STATE.md           where things stand; open questions
fixtures/          the YAML vectors
```

Decisions affecting exactly one package live in that package's own `docs/decisions/`, numbered in its own sequence. When in doubt the decision is project-wide: a decision filed in one package that turns out to constrain another is worse than a project-wide decision that only ever mattered to one.

The fixtures repository is therefore the hub, and `maya-orient` resolves it by looking for `STATE.md` rather than by name.

## Consequences

**Easier.** One numbering sequence for cross-cutting decisions, with no chance of two repositories both claiming `0004`. Findings sit next to the vectors they justify, so a fixture's provenance and the research behind it are reviewed in the same pull request. The hub is a repository with a reason to be opened, so its documentation stays current.

**Harder.** The fixtures repository now carries two purposes — a published dataset and the project's documentation — and its release cadence serves the first while its edit cadence serves the second. Documentation commits will trigger dataset releases unless the publish workflow ignores `docs/**`, which it must.

The "is this project-wide?" judgement will sometimes be got wrong, and a decision will need moving. Moving it means a new number in the new location and a `superseded by` pointer in the old, never a silent relocation.

**Now has to be true elsewhere.** The publish workflow filters `docs/**` out of release triggers. Every skill that writes to `docs/` targets the fixtures repository by default, and says so when it does. `maya-record` numbers project-wide decisions from that repository's sequence and asks, rather than guesses, when a decision looks package-local.
