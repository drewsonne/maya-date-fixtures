# 0005. The app deletes its embedded implementation and consumes the four-layer stack

- Status: proposed
- Date: 2026-09-13
- Depends on: 0001, 0002, 0003, 0004, 0006

## Context

`maya-calculator` is the app an academic would actually use, and it has not been touched since 2023-01-04. It contains a complete parallel implementation of the project: `js/model.js` (908 lines) defines `MayaDate`, `LongCount`, `DistanceNumber`, `CalendarRound`, `CalendarRoundFactory`, `LongCountFactory`, `CorrelationConstant`, `Comment`, `PartialLongCount` and `PartialCalendarRound`; `js/jdate.js` (147 lines) adds Julian date handling; `PatternMatcher` does input parsing by regex.

It was created 2019-08-20, four months before `maya-dates`. It is the ancestor the library was extracted from, and it has been maintained in parallel ever since.

The two agree on more than they disagree: the same mixed-radix arithmetic (winal base-18, other positions base-20), the same default correlation constant 584283 (GMT), the same wildcard character `*`. Default output and input syntax do not change under consolidation.

They are not equally trustworthy. The app has 333 lines of tests against 1,055 lines of date logic; `maya-dates` has 3,488 against 5,094. The app decomposes day numbers by progressive subtraction — `(total_k_in - this.total_k_in()) / 20 % 18` — where the library uses `Math.floor(n / 20) % 18`. Equivalent in intent, materially harder to verify, and a credible home for the arithmetic errors suspected in the app.

The constraint that made this non-obvious: the app's README states a deliberate principle — "simple, lightweight, and resistant to becoming legacy… relies on only jQuery and bootstrap." Adopting packages with a build step contradicts it directly.

That principle has been tested and it failed on its own terms. The repo has no build step and four date libraries in play (`julian`, `julian-date`, `moment-timezone`, and a vendored `luxon.js`); jQuery 3.4.1, Bootstrap and intro.js are committed to git; CI is Travis on Node 12 and has not run in years; fifteen Dependabot pull requests stand open, the oldest from 2021-09-01. Avoiding a build step did not prevent legacy. It removed the mechanism that would have shown it happening.

## Decision

`js/model.js` and `js/jdate.js` are deleted. `PatternMatcher` is deleted. The app keeps only presentation: the UI in `app.js` and `tutorial.js`, the markup, and the tutorial content.

Redistribution of what it currently holds:

- representation and conversion → `@drewsonne/maya-dates` (layer 1)
- `LinkedListElement` / `younger_sibling` multi-line chaining, distance numbers, wildcard expansion → `@drewsonne/maya-date-operations` (layer 2)
- `PatternMatcher` input parsing → `@drewsonne/maya-calculator-parser` (layer 3)

`julian`, `julian-date` and `moment-timezone` are dropped, as is the vendored `luxon.js`; `moonbeams` arrives transitively through layer 1. jQuery, Bootstrap and intro.js stop being committed to git and become declared dependencies. Travis is replaced by the single CI workflow from 0002. The package is renamed from `maya-calendar` to match its repository.

The deletion is gated on differential testing against the fixture suite: the same inputs run through both implementations, and every divergence is recorded as a finding in the hub's `docs/research/` (0007) and resolved by decision. The library is treated as correct only where a cited source agrees with it — not by default.

## Consequences

**Easier.** One implementation of Maya calendar arithmetic, tested to the standard the domain requires. The app inherits Lord of the Night, Julian dates, six named correlation constants, wildcard iteration and i18n locales without reimplementing them. Correctness work stops being done twice.

**Harder.** The app needs a bundler, and therefore a build step and working CI. That is the real cost of this decision and it is not optional.

Lenient input is the open risk. The app deliberately accepts out-of-range positions and normalises them (`is_valid()`, `normalise()`); `maya-dates` raises on negative Maya Day Numbers and on malformed Gregorian input. Whether it accepts out-of-range Long Count positions as the app does is **unverified** and must be settled by differential test, not assumption. If it does not, either layer 1 gains a lenient construction path or the app normalises before constructing — a further decision, not part of this one.

**Now has to be true elsewhere.** Layer 1's public API becomes the app's contract, so semantic versioning has to be observed in earnest. The app is a deployed application, not a published library, so it is versioned and released differently from the three packages beneath it — worth stating because all three repositories currently look alike.
