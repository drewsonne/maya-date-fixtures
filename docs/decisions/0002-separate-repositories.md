# 0002. The packages stay in separate repositories

- Status: accepted
- Date: 2026-09-13
- Accepted: 2026-09-13
- Supersedes the earlier monorepo draft of this number

## Context

0001 establishes four layers. The question is whether they live in one repository or several.

The case for a monorepo is coordination. The costs of the current split are evidenced, not hypothetical: `maya-calculator-parser` pins `@drewsonne/maya-dates ^1.0.20` against a current 1.3.12, three years of skew inside one author's own dependency chain; `maya-dates` issue #142 would break the parser's deep imports and neither backlog knew; three CI configurations exist and two no longer run.

Against that, one argument that outweighs it: **this is open source, and repository layout sets the contributor barrier.** A monorepo is optimised for the maintainer and against the drive-by contributor. Someone who wants to fix Tzolk'in arithmetic would have to clone every package, install an application they have no interest in, understand a workspace layout, and work out which package their change belongs in. Three focused repositories are three discoverable projects with legible issue trackers; one monorepo is a single project whose issues require knowing its internal shape before they can be triaged. Forking one library becomes forking all of them.

Consumption is unaffected either way — nobody clones a repository to use a published package — so the contributor path is the only thing repository layout actually decides. For a project whose purpose includes being used and checked by other researchers, that decides it.

## Decision

The packages stay in separate repositories, one per layer, each independently versioned and published.

| layer | repository | package |
|---|---|---|
| 1 representation | `maya-dates` | `@drewsonne/maya-dates` |
| 2 operations | *new* | `@drewsonne/maya-date-operations` |
| 3 parsing | `maya-calculator-parser` | `@drewsonne/maya-calculator-parser` |
| 4 presentation | `maya-calculator` | the deployed app |
| test vectors | *new* | `@drewsonne/maya-date-fixtures` (see 0006) |

Layer 2 is named *operations*, not *calculator*. "Calculator" names a product a person operates — the app — and using the same word for the engine beneath it is what allowed the original architectural drift. `maya-calculator` keeps its name, its stars and its inbound links.

The coordination costs are accepted and mitigated rather than denied:

- **Version skew.** Renovate or Dependabot configured to bump internal dependencies and auto-merge on green. Each downstream repository additionally runs a scheduled CI job against the *latest published* version of its upstream, not only its pinned range, so skew surfaces as a failing build rather than as silence.
- **Invisible cross-repo collisions.** One user-level GitHub Project board spanning every repository is the only cross-repo work surface. Each repository's README names its downstream consumers, so a proposed breaking change states who it breaks.
- **Three CI configurations.** One reusable GitHub Actions workflow, referenced by every repository via `uses:`. One place to fix.
- **Contract tests.** Each downstream repository runs a smoke test against its upstream's *public API surface*, so a removed export fails a build rather than being discovered at publish time.

## Consequences

**Easier.** A contributor clones one small repository, runs one install, and sees one test suite. Issues are legible without knowing the project's internal shape. Each library is independently discoverable, forkable and citable. No migration: no history to preserve by subtree merge, no publish pipeline to rebuild, no risk of breaking `npm install @drewsonne/maya-dates`. The front-loaded cost of consolidation is avoided entirely.

**Harder.** A change spanning layers is not one pull request. It is land upstream, publish, bump downstream, verify — serialised, with a release between each step. `maya-fleet` cannot gate on one green `main`; it gates per repository, and waves are scoped to a single repository. Cross-layer work becomes a sequence of waves rather than one, which is slower and must be planned that way rather than discovered mid-run.

Internal dependency ranges need real discipline. The mitigations above make skew *visible*; they do not make it impossible, and `^1.0.20` against 1.3.12 happened under exactly this structure before.

**Now has to be true elsewhere.** Layer 2 needs a new repository and an initial release before 0004 can move anything into it. The reusable CI workflow has to exist before it can be referenced. `maya-plan` scopes work packages per repository rather than against workspace paths, and `maya-fleet`'s preflight runs per repository — both skills need updating for this decision. The fixture suite becomes a published package rather than a directory, which is 0006.
