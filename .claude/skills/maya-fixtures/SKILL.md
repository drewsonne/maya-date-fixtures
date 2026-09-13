---
name: maya-fixtures
description: Build and run the citation-backed correctness suite for the Maya date project — sourced Long Count, Calendar Round, day-number and western-date vectors as language-agnostic data. Use when adding test vectors, investigating suspected calendar bugs, or differential-testing two implementations.
---

# Build and run the correctness suite

Correctness is the product. An academic tool that returns a plausible wrong date is worse than one that refuses to answer, because nobody catches it. This suite is the only thing that makes the rest of the project safe to change — `maya-plan` refuses to plan arithmetic work without it and `maya-fleet` refuses to dispatch.

## The one rule that matters

**Never generate an expected value from the code under test.** A fixture derived from the implementation proves only that the implementation agrees with itself, and it permanently locks in whatever is already wrong. Every expected value comes from a published source, an independent implementation, or hand calculation shown in the file — never from running the library and recording what came back.

If a value cannot be sourced, the fixture is written with `provenance: unverified` and excluded from the trust gate. It is not quietly promoted.

## Storage

Fixtures are **data, not test code**: YAML under `docs/fixtures/`, loaded by a thin harness in each package. They have to outlive the package moves in ADRs 0004 and 0005 and be runnable from more than one layer, so they cannot live inside one package's `.spec.ts` files.

```yaml
# docs/fixtures/long-count-calendar-round.yaml
- id: era-base
  long_count: "13.0.0.0.0"
  calendar_round: "4 Ajaw 8 Kumk'u"
  lord_of_night: G9
  maya_day_number: 1872000
  julian_day_number: 2456283
  gregorian_proleptic: "2012-12-21"
  correlation: 584283          # GMT
  provenance: attested         # attested | derived | unverified
  source: "<Author Year, work, page or table>"
  checked: 2026-09-13
  notes: ""
```

`provenance` values: `attested` — a published inscription, table or worked example, cited to author, year and page or table number. `derived` — hand-calculated or produced by an independent implementation, with the derivation in `notes`. `unverified` — stated from memory, flagged, and gated out.

A citation is author, year and location in the work. "Coe" is not a citation. "Coe 2011, Table 2" is. Never attribute a value to a work you have not seen.

## What to cover

Source values for these before anything else. They are where mixed-radix calendar code actually breaks:

- **Winal rollover.** Winal is base-18, every other position base-20. `0.0.0.17.19 → 0.0.1.0.0`.
- **Higher-position rollover.** Bak'tun into piktun, and the era base.
- **Proleptic Gregorian.** Almost every Maya date predates 1582, so the proleptic extension is the normal case, not the edge case. Include dates either side of the 1582-10-04 / 1582-10-15 Julian–Gregorian transition, and assert Julian and Gregorian separately for the same day.
- **Haab coefficient convention.** Authors differ on whether the first day of a Haab month is 0 or 1 (the "seating" question). This is a genuine scholarly divergence, not an implementation detail. Record which convention each source uses, in that fixture's `notes`. Divergence between sources is a finding for `maya-record`, not something to average.
- **Calendar Round ambiguity.** A Calendar Round repeats every 18,980 days, so a CR alone maps to many Long Counts. Fixtures must assert the candidate set, not a single answer.
- **Tzolk'in and Haab cycles** — 260 and 365, and the 5-day Wayeb with coefficients below the usual range.
- **Lord of the Night** — the 9-day cycle, including where it wraps.
- **Correlation constants.** The same Long Count under each supported constant. Changing the constant must move the western date by exactly the difference.
- **Distance numbers** across every rollover above, in both directions.
- **Rejection cases.** Inputs that must fail, and the error each must produce. Negative Maya Day Numbers, malformed positional strings, out-of-range coefficients.

## Lenient input

The app deliberately accepts out-of-range positions and normalises them; the library raises on some inputs. Whether they agree is unverified and is the open risk in ADR 0005. Write fixtures that pin the intended behaviour explicitly, and mark any case where the two implementations currently disagree as a finding rather than picking a winner.

## Differential mode

When two implementations exist (the app's `js/model.js` against `@drewsonne/maya-dates`, or a package before and after a move):

1. Run every fixture through both.
2. Report agreements, disagreements, and cases only one handles, as three separate lists.
3. For each disagreement, check the fixture's source. The sourced value wins. If the fixture is `unverified`, neither wins — it becomes a research question in `docs/research/`.
4. Never resolve a disagreement by changing the fixture.

A move that was supposed to preserve behaviour and produces disagreements has broken something. Say so.

## Running

Packages test with `mocha -r ts-node/register 'src/**/*.spec.ts'`; the legacy app uses jest. The harness reads the YAML and generates cases, so a new fixture needs no new test code. Report results as counts by provenance — `attested` failures are serious, `unverified` failures are information.

## Rules

- Add fixtures before changing the behaviour they cover, never after.
- One concept per fixture file; name files for the behaviour, not the layer.
- A failing `attested` fixture blocks the change. It does not get skipped, marked pending, or annotated as known-failing.
- When a fixture reveals a bug, record the bug as an issue and the sourced fact as a finding via `maya-record`. The fixture is the evidence, not the write-up.
- Do not expand coverage for its own sake. Twenty sourced fixtures over the cases above are worth more than two hundred generated ones, and two hundred generated ones are worth less than nothing.
