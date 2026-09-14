# Where things stand

Hub repository for the Maya Dates project, per ADR 0007. Holds project-wide decisions,
research findings, the product spec, work plans, and the published fixture dataset.

## Status

Architecture partly ratified, product specified, work planned; no fixtures written yet.

- ADRs 0001, 0002 and 0006 are `accepted` (2026-09-13). 0001 was amended during
  acceptance: layer 2 is `@drewsonne/maya-date-operations`, not
  `@drewsonne/maya-calculator`. ADRs 0003, 0004, 0005, 0007 and 0008 remain `proposed`.
- Product spec and maintenance backlog live in `docs/product/` (from the maya-spec
  interview, 2026-09-13).
- The fixtures-first plan (`docs/plan/2026-09-13-fixtures-first.md`) is decomposed into
  9 GitHub issues across 4 waves on `maya-date-fixtures`, all on the project board.

Repository facts are re-verified rather than carried forward — see
`docs/research/repository-state.md`, checked 2026-09-13.

## Next

1. Accept or amend the remaining ADRs: 0003, 0004, 0005, 0007, 0008.
2. Create the layer-2 repository (`@drewsonne/maya-date-operations`) — blocks 0004.
3. Clear the 34 open pull requests: 15 on `maya-calculator`, 19 on
   `maya-calculator-parser` (mechanical dependency bumps plus unreviewed Copilot PRs).
   `maya-dates` is already clear.
4. Start wave 1: issue #1 (`wave-1-schema-ci`) gates all six wave-2 fixture issues.

## Open questions

- Does `@drewsonne/maya-dates` accept out-of-range Long Count positions the way the app
  does? Unverified. Settle by differential test, not assumption. (ADR 0005; issue #9
  exists to answer this with evidence.)
- Does `CommentWrapper` belong in layer 1 or layer 2? Unresolved. (ADR 0004)
- Layer 1 value objects declare no `readonly` fields, so immutability is unasserted. (ADR 0001)
- Spanish renderings of Calendar Round, Distance Number and Lord of the Night need
  sourcing against Kettunen & Helmke. *Cuenta Larga* is confirmed. (ADR 0008)
- Release/versioning tooling and app deployment now that Travis is dead. No ADR yet.
