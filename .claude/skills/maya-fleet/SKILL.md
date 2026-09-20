---
name: maya-fleet
description: Gate, dispatch and collect a wave of parallel agents against a maya-plan wave. Use only when a plan exists and the fixture suite passes; it refuses to run otherwise.
---

# Dispatch a wave

Three phases: preflight, dispatch, collect. Preflight is not advisory — if it fails, report which check failed and stop. Do not offer to proceed anyway.

The reason the gate is strict: eleven agent-authored pull requests once sat unmerged on this project for eight months. Agent capacity was never the constraint. Review throughput is. A wave is only worth dispatching if its output can be trusted without reading every line, and that is what the fixture suite buys.

## Phase 1 — preflight

Every check must pass.

1. `gh auth status` succeeds.
2. The named wave exists in `docs/plan/` and every package in it carries scope, contract, criteria and fixtures.
3. No two packages in the wave share a path glob.
4. Every `depends_on` points at a package in an earlier, completed wave.
5. `main` is green: the full suite passes on a clean checkout.
6. The fixture suite exists, covers every behaviour the wave touches, and passes.
7. Open pull requests on the target repo are either resolved or explicitly deferred with a note in the plan. A stale backlog means every agent branch conflicts.
8. Every package's task issue is a sub-issue of an open story on the hub (ADR 0009). An orphan task is a planning defect — route it back to `maya-plan`.
9. If the wave was planned before this session, re-validate each package against current `main` (scope paths still exist, contract still true, fixtures still cover it). A stale package is re-planned, not dispatched.

Report the checks as a pass/fail list. On any failure, name the failed check and the smallest action that clears it, then stop.

## Phase 2 — dispatch

This is what the Workflow tool is for: one agent per package, the wave in parallel. Workflow needs Drew's explicit go-ahead each run — confirm it before calling, and never infer it from an earlier run.

Each agent receives only: its package block, its path scope, the command that runs the fixtures, and the instruction to open a draft pull request and stop.

One wave at a time. Never dispatch the next wave from inside a run.

## Hard rules for agents

Put these in every agent prompt, verbatim:

- Modify only files matching your scope. A change outside it fails the package.
- **Never modify a fixture file, a spec file, or an expected value to make a test pass.** If a fixture disagrees with your implementation, the fixture wins and your package is blocked — report it, do not resolve it. On a calendar tool an agent that edits an expected date to get green has produced something worse than nothing.
- Do not change anything listed in your package's contract.
- Open a draft pull request. Never merge, never push to main.
- If your acceptance criteria are ambiguous, stop and report the ambiguity. Do not interpret.
- Reference your task in the PR description with the full cross-repo form (`Closes drewsonne/maya-date-fixtures#N`). On a satellite repo a bare `Closes #N` closes nothing (ADR 0009).

## Phase 3 — collect

One table, not one report per package:

| package | PR | fixtures | criteria met | notes |
|---|---|---|---|---|

For each: run the fixture suite against the branch, check each acceptance criterion, and diff the changed paths against the declared scope. Flag any package that touched a fixture file — treat it as failed regardless of whether tests pass.

If more than a third of the wave fails, stop. Do not dispatch the next wave and do not retry in place; the plan was wrong, so return to `maya-plan`.

Drew reviews and merges. Never merge on his behalf, and never mark a wave complete while a pull request is open.

## Rules

- One wave per invocation.
- Never widen a package's scope to unblock an agent mid-run. Stop the run and re-plan.
- Report what happened, including the boring outcome. "Four of six passed, two blocked on a fixture disagreement" is the useful result, and the fixture disagreements are findings worth recording with `maya-record`.
