# Maya Dates project skills

Eight Claude Skills that manage this project: define the product, capture decisions, prove correctness, plan work, dispatch agents to do it, and review the result (`maya-implement` and `maya-review` complete the set below).

Work is tracked per ADR 0009: all issues live on this hub repo as a native
sub-issue hierarchy — epic (label `epic`) → story (label `story`) → task
(type Task, a maya-plan package block). Tasks are created just-in-time, at
most the wave in flight plus one planned ahead; satellite-repo PRs close hub
tasks with the full cross-repo form (`Closes drewsonne/maya-date-fixtures#N`).

Each is a directory containing a `SKILL.md`. Committing this tree to the repo root is all the installation needed — Claude Code discovers `.claude/skills/*/SKILL.md` automatically when run with this repo as the working directory.

## The skills

| skill | job | reads | writes |
|---|---|---|---|
| `maya-orient` | session entry: repo map, work in flight, blockers, three sized next actions | everything | nothing |
| `maya-spec` | interviews you into a product definition, one topic per round | — | `docs/product/` |
| `maya-record` | a settled decision (ADR) or a sourced finding | `docs/decisions/` | `docs/decisions/`, `docs/research/` |
| `maya-fixtures` | citation-backed correctness vectors; differential testing | `docs/fixtures/` | `docs/fixtures/` |
| `maya-plan` | spec → non-colliding work packages grouped into waves | `docs/product/`, `docs/decisions/` | `docs/plan/`, issues |
| `maya-fleet` | preflight gate → dispatch one wave → collect results | `docs/plan/`, `docs/fixtures/` | pull requests |

## How they chain

```
maya-spec ──► maya-fixtures ──► maya-plan ──► maya-fleet
                                                  │
maya-orient (session start)                       ▼
maya-record (whenever something settles) ◄── findings, blocked packages
```

`maya-fixtures` sits between spec and plan deliberately. `maya-plan` refuses to plan calendar-arithmetic work that no fixture covers, and `maya-fleet` refuses to dispatch against a suite that does not pass. Without fixtures the chain is a locked door — which is the intended behaviour on a project where correctness is the product.

## Invoking them

Either let Claude trigger a skill from its `description`, or call it by name: `/maya-orient`, `/maya-plan`, and so on.

## Conventions they assume

The skills read and write a fixed layout. They create directories they need, but they expect this shape:

```
docs/
  product/      prd.md, non-goals.md, maintenance-backlog.md
  decisions/    NNNN-kebab-title.md   (Nygard ADRs)
  research/     <topic>.md            (sourced findings, citations required)
  fixtures/     *.yaml                (test vectors, citations required)
  plan/         <slug>.md             (waves and work packages)
  STATE.md      where things stand; open questions
```

They also assume the four-layer architecture from ADR 0001 — representation, operations, parsing, presentation, with dependencies pointing inward only — and the npm-workspaces monorepo from ADR 0002. **ADR 0002 has to land before `maya-plan` is useful**, because it scopes work packages against workspace paths and `maya-fleet` gates on one green `main` and one test suite.

## Rules worth knowing before you use them

These are enforced by the skills, not suggestions:

- **`maya-fixtures`: never generate an expected value from the code under test.** A fixture derived from the implementation proves only that it agrees with itself, and cements whatever is already wrong. Values come from a published source, an independent implementation, or hand calculation shown in the file.
- **`maya-fleet`: agents may never edit a fixture, spec, or expected value to make a test pass.** Doing so fails the package regardless of whether tests then pass. On a calendar tool, an agent that adjusts an expected date to get green has produced something worse than nothing.
- **`maya-plan`: no package whose acceptance criteria a human has to eyeball.** If it cannot be checked by a machine it cannot be dispatched.
- **`maya-spec`: the epigrapher test.** A requirement you cannot justify to a working epigrapher is marked `dx-only` and leaves the PRD. Not condemned — just not competing with product scope.
- **`maya-record`: one decision per file**, and every research claim carries author, year, and page or table number.

## Installing

**Project-scoped (recommended).** Commit this `.claude/skills/` tree at the repository root. Discovery is automatic; nothing to enable. Versioned alongside the conventions the skills encode, reviewable in a pull request, and available to anyone — or any agent — working in the repo.

**User-scoped.** Copy the skill directories into `~/.claude/skills/` to have them in every session regardless of working directory. Useful for `maya-orient`, less so for the rest, which only make sense inside the repo.

Project and user scope are separate from skills saved to a claude.ai account; they do not sync. Pick the repo as the source of truth and avoid keeping edited copies in more than one place.
