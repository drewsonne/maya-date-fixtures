# 0001. Four layers with inward-only dependencies

- Status: accepted
- Date: 2026-09-13
- Accepted: 2026-09-13, amended in the same pass: layer 2 is named
  `@drewsonne/maya-date-operations` per 0004, not `@drewsonne/maya-calculator`
  as originally drafted

## Context

The project is intended as three layers: a raw Maya date representation with no operations, a calculator performing operations on those dates, and a GUI with input parsing. The code does not match that intent, and nothing detects the mismatch.

| intended layer | where it actually lives |
|---|---|
| representation, no operations | `maya-dates` — which also contains the operations |
| calculator operations | nowhere of its own; `maya-dates/src/operations/` holds `LongcountAddition`, `LongcountSubtraction`, the abstract `LongcountOperation`, `CalendarRoundIterator` and three wildcard expanders |
| GUI with input parsing | split: GUI in `maya-calculator`, parsing in `maya-calculator-parser`, and the GUI consumes neither |

Three concrete symptoms. `maya-calculator-parser/src/index.ts` is 0 bytes while `package.json` sets `main: src/index.ts`, so the published package exports nothing and cannot be consumed at all. The GUI therefore still carries its own regex `PatternMatcher` and a complete second implementation of representation and operations in `js/model.js`. And the parser reaches into the library by deep import (`@drewsonne/maya-dates/lib/lc/long-count`), while `maya-dates` issue #142 proposes deprecating deep imports — one repository's only open issue breaks the other repository's only consumer, and neither backlog knows.

The boundary that had to be settled first: whether calendar conversion is representation or operation. Decided as representation — positional notation, Maya day number and a western date are three encodings of one value, and a date that cannot convert itself is not independently useful.

## Decision

Four layers. Dependencies point inward only; no layer imports from a layer above it.

**1. Representation — `@drewsonne/maya-dates`.** `LongCount`, `CalendarRound`, `Tzolkin`, `Haab`, `LordOfTheNight`, the correlation constants, `GregorianCalendarDate`, `JulianCalendarDate`, `fromMayanDayNumber`, and the `Wildcard` marker value. Depends only on `moonbeams`.

**2. Operations — `@drewsonne/maya-date-operations`.** Addition, subtraction, distance numbers, wildcard *expansion*, `CalendarRoundIterator`, and evaluation of a multi-line document where each line resolves against the one before. Depends on layer 1.

**3. Parsing — `@drewsonne/maya-calculator-parser`.** Text to AST: the existing layer-0 to layer-3 tokenizer. Depends on layers 1 and 2.

**4. Presentation — the app.** Depends on layers 2 and 3.

Two boundaries worth stating explicitly, because both are currently violated:

- The `Wildcard` marker is representation — a value that may appear in a date. `LongCountWildcard.run()`, which expands it into candidate dates, is an operation. The marker stays in layer 1; the expander moves to layer 2.
- `LinkedListElement` / `younger_sibling` chaining in the app is not presentation. It is the evaluation context of a multi-line expression document, and belongs in layer 2.

The intended model folded parsing into the GUI. It is kept separate here because the parser already exists as a distinct package with a spec file per layer, and is the best-structured code in the project. Folding it into the app would discard that.

## Consequences

**Easier.** The layer boundary becomes machine-checkable rather than aspirational — one lint rule on import paths (`eslint import/no-restricted-paths` or `dependency-cruiser`) in CI, and drift is caught at the pull request rather than three years later. Each layer becomes independently testable, which is what makes parallel agent work viable at all.

**Harder.** Layer 1 loses exports, so `@drewsonne/maya-dates` takes a major version bump. Layer 2 is a new package that does not exist yet. Three of the four layers need work before the app can consume any of them.

**Now has to be true elsewhere.** Layer 2 takes the name `@drewsonne/maya-date-operations` (0004), so the word "calculator" continues to name only the product a person operates — one word for two layers is what allowed the drift, and the naming split is what prevents it recurring. Layer 1's value objects should be immutable; `long-count.ts` and `calendar-round.ts` declare no `readonly` fields today, so the property the layer depends on is unasserted.
