# Plan: fixtures-first slice

Date: 2026-09-13. 9 packages, 4 waves. Target repo: `drewsonne/maya-date-fixtures`.

## Why this slice

The PRD's success test is "the app reproduces every citation-backed fixture
vector with zero failures" — a test that cannot run until the vectors and a
harness exist. Independently, this skill's own refusal rule ("calendar
arithmetic without fixtures") bars planning any arithmetic change until
fixtures cover the behaviour. Both point at the same first slice: build the
dataset, then the harness, then run the differential test that settles the
open question in ADR 0005.

**Not planned, and why:** the operations split (ADR 0004), the app rewrite
(ADR 0005), the parser public API (ADR 0003) and the layer-2 repository all
depend on ADRs that are still `proposed`. Every ADR is `proposed` as of today;
nothing here requires accepting them, because everything here is justified by
the PRD directly (arithmetic correctness §2, adjudication §3, success test §6)
with ADR 0006 as the design being followed for the dataset's shape. Accepting
ADRs 0001–0008 remains the gate for the next slice.

**Layer note:** the package shape's `layer` field enumerates the four code
layers. The dataset sits outside them by construction (ADR 0006) and feeds all
four, so these packages carry `layer: 0 dataset` — a deliberate, stated
deviation, not an oversight. The two refusal checks still apply and were run:
no package changes calendar arithmetic (all create fixtures or harnesses), and
no package introduces any import between layers.

## Wave 1 — the interface

Wave 1 is a single package because the fixture file format is the interface
every later package writes against (interface-first rule). No conflict check
needed with one package.

```
id:           wave-1-schema-ci
goal:         Every fixture record is schema-validated mechanically, with provenance and citation rules enforced in CI before any vectors exist.
layer:        0 dataset
scope:        schema/**, scripts/**, .github/workflows/**, package.json, package-lock.json
contract:     must not create or modify anything under fixtures/ or docs/; the record shape follows the maya-fixtures skill template (id, long_count, calendar_round, lord_of_night, maya_day_number, julian_day_number, gregorian_proleptic, correlation, provenance, source, checked, notes) — fields may be added, none removed or renamed
criteria:     - `npm run validate` exits 0 on schema/example.yaml
              - `npm run validate` exits nonzero for each of: a record missing `provenance`; a record with `provenance: attested` and an empty or missing `source`; an unknown provenance value; a `long_count` not matching positional notation
              - CI workflow runs `npm run validate` on push and pull_request and fails on violation
              - schema/example.yaml contains every field from the template above
fixtures:     none yet — this package creates the gate; command: npm run validate
depends_on:   []
size:         S
```

Amendments from the wave-1 review (2026-09-20): the scope gained
`package-lock.json` — any scope that includes `package.json` includes the
lockfile, here and in every future plan, because `npm ci` requires it.
The schema also enforces two provenance rules from the maya-fixtures
skill: `attested` requires a non-empty `source` (a stated criterion) and
`derived` requires a non-empty `notes` carrying the derivation (ratified
at review; not in the original criteria). Records reject unknown fields,
so adding a field to the record shape is a deliberate schema edit.

## Wave 2 — the vectors

Six packages, all depending only on wave-1-schema-ci, each owning distinct
files under `fixtures/`. **Conflict check: performed — the six scope globs are
pairwise disjoint** (`positional-rollover.yaml`, `correlation-constants.yaml` +
`proleptic-western.yaml`, `tzolkin-haab.yaml` + `haab-seating.yaml` +
`lord-of-night.yaml`, `distance-numbers.yaml`, `calendar-round-ambiguity.yaml`,
`rejection.yaml` + `lenient-input.yaml`), and no wave-2 package may touch
`schema/**`, `scripts/**` or another package's files.

Shared contract for all wave-2 packages, stated once: expected values come
from published sources or shown hand-derivation, **never from running any
implementation** (maya-fixtures rule); a value that cannot be sourced is
`provenance: unverified`, kept, and thereby excluded from the trust gate;
sources actually consulted, cited to author, year and page/table — no citation
to a work the agent has not seen. Ground-truth sources per PRD §3: Martin &
Skidmore 2012; Kettunen & Helmke; Aveni; Bricker & Bricker.

```
id:           wave-2-positional-rollover
goal:         The mixed-radix rollovers where calendar code actually breaks are pinned by sourced vectors.
layer:        0 dataset
scope:        fixtures/positional-rollover.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above
criteria:     - `npm run validate` exits 0
              - file contains a winal-rollover pair asserting 0.0.0.17.19 + 1 day = 0.0.1.0.0
              - file contains tun, k'atun and bak'tun rollover vectors, a bak'tun→piktun vector, and the era base 13.0.0.0.0 = 4 Ajaw 8 Kumk'u
              - zero records with provenance unverified in this file
fixtures:     fixtures/positional-rollover.yaml; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         S
```

```
id:           wave-2-western-correlation
goal:         Western conversion is pinned under each supported correlation constant, with the proleptic Gregorian treated as the normal case it is.
layer:        0 dataset
scope:        fixtures/correlation-constants.yaml, fixtures/proleptic-western.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above
criteria:     - `npm run validate` exits 0
              - correlation-constants.yaml carries the same Long Count under 584283, 584285 and 584286, and the western dates differ by exactly the constant differences
              - proleptic-western.yaml asserts Julian and Gregorian separately for the same day, with vectors on both sides of the 1582-10-04/1582-10-15 transition
              - every 584286 vector cites Martin & Skidmore 2012 with page or table
fixtures:     both files in scope; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         M
```

```
id:           wave-2-cycles-and-seating
goal:         Tzolk'in, Haab, Wayeb, the Haab seating divergence and the Lord of the Night cycle are pinned per convention, per source.
layer:        0 dataset
scope:        fixtures/tzolkin-haab.yaml, fixtures/haab-seating.yaml, fixtures/lord-of-night.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above; source divergence on seating is recorded per-source in notes, never averaged — a genuine divergence between sources is written up via maya-record as a finding
criteria:     - `npm run validate` exits 0
              - tzolkin-haab.yaml covers the 260- and 365-day cycle lengths and Wayeb vectors with coefficients below the usual range
              - haab-seating.yaml records, for each source used, which seating convention that source follows, in each record's notes
              - lord-of-night.yaml includes the G9→G1 wrap
fixtures:     all three files in scope; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         M
```

```
id:           wave-2-distance-numbers
goal:         Distance-number arithmetic is pinned in both directions across every rollover, including chained additions (PRD scope item 1).
layer:        0 dataset
scope:        fixtures/distance-numbers.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above
criteria:     - `npm run validate` exits 0
              - file contains forward and backward vectors across winal, tun, k'atun and bak'tun rollovers
              - file contains at least one chained vector (anchor plus two successive distance numbers with the intermediate result asserted)
fixtures:     fixtures/distance-numbers.yaml; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         S
```

```
id:           wave-2-cr-ambiguity
goal:         Calendar Round ambiguity is pinned as candidate sets, not single answers (PRD scope item 4).
layer:        0 dataset
scope:        fixtures/calendar-round-ambiguity.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above
criteria:     - `npm run validate` exits 0
              - each vector asserts the full candidate Long Count set for a Calendar Round within a stated window, and two candidates in one set differ by exactly 18,980 days
              - at least one vector uses a partial Calendar Round and asserts its (larger) candidate set
fixtures:     fixtures/calendar-round-ambiguity.yaml; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         M
```

```
id:           wave-2-rejection-and-leniency
goal:         Inputs that must fail are pinned with their required errors, and the app/library leniency divergence is pinned as intended behaviour rather than discovered later.
layer:        0 dataset
scope:        fixtures/rejection.yaml, fixtures/lenient-input.yaml
contract:     no changes outside scope; schema unchanged; shared wave-2 contract above; where the intended lenient behaviour has no published source it is provenance: unverified and stays gated out — it is not promoted to make the file look finished
criteria:     - `npm run validate` exits 0
              - rejection.yaml covers negative Maya Day Numbers, malformed positional strings and out-of-range coefficients, each with the required error named
              - lenient-input.yaml pins intended normalisation for out-of-range positions explicitly per case
fixtures:     both files in scope; command: npm run validate
depends_on:   [wave-1-schema-ci]
size:         S
```

## Wave 3 — the harness

One package; no intra-wave conflict possible.

```
id:           wave-3-js-harness
goal:         Every fixture runs mechanically against the published @drewsonne/maya-dates, reported by provenance, so an attested failure blocks and an unverified failure informs.
layer:        0 dataset
scope:        harness/js/**, package.json (scripts + devDependencies only), package-lock.json
contract:     must not modify schema/**, scripts/**, fixtures/**, or any file in any other repository; consumes @drewsonne/maya-dates as published from npm, not from a local path; never edits a fixture to make a test pass (maya-fixtures rule: the sourced value wins)
criteria:     - `npm run harness` loads every fixtures/*.yaml without per-fixture test code and executes each vector against @drewsonne/maya-dates
              - output reports pass/fail counts grouped by provenance
              - exit code is nonzero if and only if at least one attested vector fails
              - doubles as the JS loader example required by ADR 0006's language-agnostic claim
fixtures:     all of fixtures/; command: npm run harness
depends_on:   [wave-1-schema-ci, wave-2-positional-rollover, wave-2-western-correlation, wave-2-cycles-and-seating, wave-2-distance-numbers, wave-2-cr-ambiguity, wave-2-rejection-and-leniency]
size:         M
```

## Wave 4 — the differential test

One package; no intra-wave conflict possible. This is investigation, not a
code change to any implementation: its outputs are findings and issues.

```
id:           wave-4-differential-app-library
goal:         The open question in ADR 0005 — whether the app's embedded implementation and @drewsonne/maya-dates agree, including on out-of-range Long Counts — is settled by evidence.
layer:        0 dataset
scope:        harness/differential/**, docs/research/** (new files only)
contract:     modifies nothing in maya-calculator or maya-dates; reads the app's js/model.js as-is; never resolves a disagreement by editing a fixture; disagreements on unverified fixtures become research questions, not verdicts
criteria:     - `npm run differential` runs every fixture through both js/model.js and @drewsonne/maya-dates and emits three lists: agreements, disagreements, handled-by-only-one
              - each disagreement in the output names the fixture id and the sourced expected value
              - a docs/research/ finding (via maya-record) answers the ADR 0005 out-of-range question with the evidence attached
              - one GitHub issue exists per implementation bug found, on the repo that owns the bug
fixtures:     all of fixtures/; command: npm run differential
depends_on:   [wave-3-js-harness]
size:         M
```

## Checks performed

- **Intra-wave scope conflicts:** checked every wave; wave 2's six globs are
  pairwise disjoint; waves 1, 3 and 4 are single-package.
- **Dependencies point only backwards:** checked; wave 2 → wave 1,
  wave 3 → waves 1–2, wave 4 → wave 3.
- **No L packages.** Largest is M.
- **Refusal 1 (arithmetic without fixtures):** no package changes arithmetic;
  the slice exists to make future arithmetic work plannable at all.
- **Refusal 2 (cross-layer imports):** no package adds imports between layers.
- **Traceability:** every package traces to PRD §2/§3/§4/§6 or ADR 0006 as
  noted per package.
