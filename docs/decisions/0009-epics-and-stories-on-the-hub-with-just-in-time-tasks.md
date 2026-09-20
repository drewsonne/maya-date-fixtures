# 0009. Work is tracked as epics and stories on the hub, with just-in-time tasks

- Status: accepted
- Date: 2026-09-20

## Context

The project is built through a skill pipeline (spec → plan → fleet → review)
whose planning unit, the work package, is already sized for one agent, one
branch, one PR. What sits above the package is undefined: nothing connects a
package to a product outcome, and nothing says when packages may be created.

Two constraints force the choice. First, review throughput — not agent
capacity — limits this project; eleven agent-authored PRs once sat unmerged
for eight months because work was generated far ahead of the ability to
review it. Second, LLM decomposition is nearly free to regenerate, so a
stored task inventory is a liability, not an asset: pre-written tasks encode
assumptions about code that has changed by the time an agent executes them.

GitHub's native facilities on a personal account are: sub-issue hierarchies
(cross-repo capable), the fixed issue types Task / Bug / Feature, no custom
issue types or fields, and Projects v2 reachable only via `gh` (the installed
GitHub MCP drives issues and sub-issues but not the board).

## Decision

We track work as a three-level native sub-issue hierarchy, entirely on the
hub repository (`maya-date-fixtures`, per ADR 0007):

- **Epics** — issues labelled `epic`, type Feature. Each traces to a PRD
  outcome. Few, long-lived, no acceptance criteria of their own.
- **Stories** — sub-issues of an epic, labelled `story`, type Feature.
  Outcome-phrased with machine-checkable acceptance criteria. A story
  carries no implementation decomposition.
- **Tasks** — sub-issues of a story, type Task. A task is a `maya-plan`
  work package, verbatim. Tasks are created just-in-time: at most the wave
  in flight plus one planned wave may hold open tasks. The queued wave is
  re-validated against current `main` at dispatch; stale packages are
  re-planned, not dispatched.

Code lives in the satellite repos, but every issue lives on the hub. Pull
requests on satellite repos close their hub task with a full cross-repo
reference (`Closes drewsonne/maya-date-fixtures#N`); the bare `Closes #N`
form is a bug in a satellite PR.

## Consequences

Orientation reads one tracker, and the hierarchy is drivable by the GitHub
MCP end to end (create-with-parent, reparent, tree walks). The horizon rule
turns the review-throughput constraint into a mechanical gate: `maya-plan`
refuses to decompose beyond in-flight-plus-one, and `maya-fleet` refuses to
dispatch a queued wave without re-validation.

It becomes mandatory that agent prompts and `maya-implement` require the
full cross-repo close syntax, since a bare `#N` in a satellite PR silently
fails to close anything. The hub's issue list mixes three levels and is
read filtered by label or type. Board status remains a `gh` CLI concern
outside the MCP.

The nine existing plan issues on the hub predate this model and are
retrofitted: one epic for the correctness suite, stories beneath it, and
the existing wave issues attached as tasks. Wave 1 (PR #10) completes under
the old shape.

Supersedes nothing; extends ADR 0006 (dataset) and ADR 0007 (hub) with a
work-management model. If review throughput changes materially, the
horizon constant ("plus one wave") is the first thing to revisit — by a
superseding decision, not by drift.
