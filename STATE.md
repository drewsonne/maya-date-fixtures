# Where things stand

Hub repository for the Maya Dates project, per ADR 0007. Holds project-wide decisions,
research findings, the product spec, work plans, and the published fixture dataset.

## Status

Framework and architecture decided; nothing implemented yet. Every ADR is `proposed`.

Repository facts are re-verified rather than carried forward — see
`docs/research/repository-state.md`, checked 2026-09-13. Several figures that circulated
in earlier planning notes were already stale by the time the hub was created.

## Next

1. Accept or amend ADRs 0001-0008.
2. Create the layer-2 repository (`@drewsonne/maya-date-operations`) — blocks 0004.
3. Clear the 34 open pull requests: 25 mechanical dependency bumps across `maya-calculator`
   and `maya-calculator-parser`, 8 unreviewed Copilot PRs on the parser, and PR #15.
   `maya-dates` is already clear.
4. Write the first fixtures: winal rollover, proleptic Gregorian, Haab seating convention,
   Calendar Round ambiguity.
5. `maya-spec` the product before planning any work.

## Open questions

- Does `@drewsonne/maya-dates` accept out-of-range Long Count positions the way the app
  does? Unverified. Settle by differential test, not assumption. (ADR 0005)
- Does `CommentWrapper` belong in layer 1 or layer 2? Unresolved. (ADR 0004)
- Layer 1 value objects declare no `readonly` fields, so immutability is unasserted. (ADR 0001)
- Spanish renderings of Calendar Round, Distance Number and Lord of the Night need
  sourcing against Kettunen & Helmke. *Cuenta Larga* is confirmed. (ADR 0008)
- Release/versioning tooling and app deployment now that Travis is dead. No ADR yet.
