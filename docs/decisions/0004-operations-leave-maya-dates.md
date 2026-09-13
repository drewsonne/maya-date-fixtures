# 0004. Operations move out of maya-dates into @drewsonne/maya-date-operations

- Status: proposed
- Date: 2026-09-13
- Depends on: 0001, 0002, 0006

## Context

0001 places representation in layer 1 and operations in layer 2. Today both are in `@drewsonne/maya-dates`. `src/operations/` contains `LongcountAddition`, `LongcountSubtraction`, the abstract `LongcountOperation`, `CalendarRoundIterator`, `LongCountWildcard`, `CalendarRoundWildcard` and `FullDateWildcard`, and `src/index.ts` re-exports all of them.

Calendar conversion stays in layer 1 by the boundary settled in 0001: positional notation, Maya day number and a western date are three encodings of one value. So `fromMayanDayNumber`, `GregorianCalendarDate`, `JulianCalendarDate` and the correlation constants do **not** move.

The distinction that decides the wildcard files: the `Wildcard` marker is a value that may legitimately appear inside a date, and is representation. `LongCountWildcard.run()`, which expands a wildcarded date into its candidate set, is an operation on that value. The marker stays; the expanders move.

`maya-dates` has 5,094 lines of source and 3,488 lines of specs across 21 spec files. Whatever moves must take its tests with it, and the split must not lose coverage.

## Decision

`src/operations/` moves to a new repository, published as `@drewsonne/maya-date-operations`, together with its spec files. Named *operations* rather than *calculator* per 0002: "calculator" names the product a person operates, and reusing it for the engine is what allowed the original drift. `@drewsonne/maya-dates` drops those exports from `src/index.ts` and releases **2.0.0**. `LinkedListElement` / `younger_sibling` document-chaining arrives in the same package from the app under 0005, since multi-line evaluation is the same concern.

The move is gated on the citation-backed fixture package `@drewsonne/maya-date-fixtures` (0006). Fixtures are written and passing against the current combined package **before** any file moves, and must pass unchanged afterwards. A fixture may not be edited to accommodate the move; a fixture that fails after the move means the move broke something.

## Consequences

**Easier.** Layer 1 becomes what it was meant to be: values, their encodings, and equality. Operations gain a package where the multi-line evaluation model can live properly instead of being reimplemented in the app. The layer-boundary lint rule from 0001 becomes enforceable, because there is finally a boundary to enforce.

**Harder.** This is a breaking change to the only published library with external consumers. Anyone importing `LongcountAddition` from `@drewsonne/maya-dates` breaks on 2.0.0, and a migration note in the release is the minimum owed to them. The parser depends on layer 2 as well as layer 1 under 0001, so 0003's public API has to be shaped with that in mind — doing 0003 first and 0004 second means revisiting the parser's imports twice unless both are planned together.

**Now has to be true elsewhere.** The fixture package must exist, be published, and pass before this starts; it is the gate, not a follow-up. The abstract `LongcountOperation` base class and the `IPart` / `CommentWrapper` interfaces it extends straddle the boundary — `IPart` is representation, the operation base is not. Whether `CommentWrapper` belongs in layer 1 or layer 2 is unresolved and needs settling during the move, not assumed.
