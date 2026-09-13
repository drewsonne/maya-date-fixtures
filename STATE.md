# Where things stand

Hub repository for the Maya Dates project, per ADR 0007. Holds project-wide decisions,
research findings, the product spec, work plans, and the published fixture dataset.

## Status

Framework and architecture decided; nothing implemented yet. Every ADR is `proposed`.

## Next

1. Accept or amend ADRs 0001-0008.
2. Create the layer-2 repository (`@drewsonne/maya-date-operations`) — blocks 0004.
3. Clear the ~53 open pull requests across the existing repos (49 are mechanical bumps).
4. Write the first fixtures: winal rollover, proleptic Gregorian, Haab seating convention.
5. `maya-spec` the product before planning any work.

## Open questions

- Does `@drewsonne/maya-dates` accept out-of-range Long Count positions the way the app
  does? Unverified. Settle by differential test, not assumption. (ADR 0005)
- Does `CommentWrapper` belong in layer 1 or layer 2? Unresolved. (ADR 0004)
- Layer 1 value objects declare no `readonly` fields, so immutability is unasserted. (ADR 0001)
