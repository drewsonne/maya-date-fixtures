---
name: maya-plan
description: Decompose the Maya dates product spec into dependency-ordered work packages sized for independent parallel agent execution, then write them to docs/plan/ and GitHub Issues. Use after specs or ADRs settle and before dispatching any agents.
---

# Plan work packages

A work package is one agent, one branch, one pull request, one non-overlapping file scope. Planning output that cannot be executed in parallel is not a plan, it is a list.

Replaces any general issue-triage approach. Drew already writes well-structured issues with acceptance criteria; the job here is decomposition and conflict avoidance, not issue hygiene.

## Inputs

Read before planning: `docs/product/prd.md`, `docs/decisions/` (every accepted ADR), `docs/plan/` (existing waves), and the open issues on the target repo. Plan only what the spec or an ADR justifies.

## Package shape

Every package carries all of these. A package missing any field is not ready to dispatch.

```
id:           wave-N-short-slug
goal:         one sentence, an outcome
layer:        1 representation | 2 operations | 3 parsing | 4 presentation
scope:        explicit path globs the agent may modify
contract:     what it must NOT change (exported signatures, fixture files, other layers)
criteria:     - machine-checkable assertion
              - machine-checkable assertion
fixtures:     which fixture files must pass, and the command that runs them
depends_on:   [package ids]
size:         XS | S | M | L
```

An acceptance criterion a human has to eyeball is not a criterion. "Long Count parsing is more robust" fails. "`parse('9.16.4.10.8')` returns a LongCount; `parse('9.16.4.10')` throws naming the missing position" passes.

## Waves

Group packages into waves. Within a wave, **no two packages may share a path glob** — check this explicitly and state that you checked. Across waves, `depends_on` must point only backwards.

At most six packages per wave. An `L` package is a planning failure: split it before the plan is finished.

## Interface-first rule

If package B needs a type or function signature that package A introduces, A lands that signature in an earlier wave — a stub with the right shape is enough. Two agents must never negotiate an interface between themselves; they will produce two incompatible ones and both will pass their own tests.

## Two refusals

**Calendar arithmetic without fixtures.** If a package would change Long Count, Calendar Round, day-number or correlation-constant logic and no fixture covers that behaviour, do not plan it. Emit a fixture package into an earlier wave and make the change depend on it. Say plainly that you did this.

**Cross-layer imports.** Per ADR 0001, dependencies point inward only: presentation → parsing → operations → representation. A package that would introduce an import from a lower layer to a higher one is rejected, not planned around.

## Hierarchy and horizon (ADR 0009)

Packages are **tasks** in a three-level hierarchy that lives entirely on the
hub repo: **epic** (label `epic`, type Feature, traces to a PRD outcome) →
**story** (label `story`, type Feature, sub-issue of its epic, outcome-phrased
with machine-checkable criteria, never decomposed in its own body) → **task**
(type Task, sub-issue of its story, the package block verbatim).

Decompose just-in-time: at most the wave in flight **plus one planned wave**
may hold open task issues. Refuse to decompose further ahead, however much the
spec would support — regenerating decomposition later is cheap, and a task
inventory goes stale. A queued wave is re-validated against current `main`
before dispatch; a stale package is re-planned, not dispatched.

If a package's story or epic does not exist yet, create it first and attach
the task beneath it. A task without a story is not ready to file.

## Output

- `docs/plan/<slug>.md` — the waves, packages in full, and the conflict check.
- One GitHub issue per package **on the hub repo**, type Task, created as a sub-issue of its story (ADR 0009), body containing the package block verbatim, labelled `wave-N`, `layer-N` and its size.
- Added to the project board if `gh auth status` shows the `project` scope; if not, create the issues anyway and say to run `gh auth refresh -s project`.

## Rules

- Never invent work. Every package traces to a spec requirement or an ADR.
- Search existing issues before creating any (`gh issue list --search`). Update a match rather than opening a duplicate.
- No due dates, no milestones, no estimates in hours. Sizes are for sequencing and for matching a package to available energy, nothing else.
- State the total package count and wave count up front. If the plan exceeds about fifteen packages, stop and propose a narrower first slice instead.
