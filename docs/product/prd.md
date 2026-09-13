# Maya date calculator — product requirements

Status: interviewed and written, 2026-09-13 (maya-spec). Every requirement in
this document was stated or confirmed by Drew in the interview; nothing is
inferred from existing code.

## 1. Who uses this, and for what task?

An epigrapher who has already read a full date and its distance numbers from an
inscription, and wants the arithmetic verified: an anchor Long Count plus one or
more distance numbers, computed forward and back, with the resulting Calendar
Round positions and western equivalents.

The user is checking their own working, not asking the tool to read the
inscription for them. The tool's job is to be a reliable second pair of hands at
the arithmetic step.

## 2. What must it get right, above everything?

The calendar arithmetic. Long Count ± distance number, Calendar Round advance,
day-number maths. If a single computed date is wrong, the tool is worthless
regardless of anything else.

Transparent working — showing the derivation so each step can be checked — is a
strong second, named in the same breath. But when forced to choose, arithmetic
survives: a correct answer with opaque working is still a usable tool; wrong
arithmetic with beautiful working is not. Transparency is a first-class
requirement, subordinate only to correctness.

## 3. What does correct mean, and who adjudicates?

**Ground truth sources**, in disputes over output:

- Martin & Skidmore (2012), *Exploring the 584286 Correlation* — the correlation
  question.
- Kettunen & Helmke, *Introduction to Maya Hieroglyphs* — worked examples usable
  as fixture vectors; already the cited source for Spanish renderings (ADR 0008).
- Aveni, *Skywatchers*; Bricker & Bricker, *Astronomy in the Maya Codices* —
  astronomical cross-checks of computed dates.

Thompson (1950/1960) was offered and not selected; it is not a ground-truth
source for this product.

**Correlation constant:** 584286 (Martin & Skidmore) is the default. The user
can switch to other constants (584283, 584285, or an arbitrary value). Every
western conversion states which constant produced it.

**Where the literature disagrees** (Haab seating, Lord of the Night numbering,
and the like): the tool picks a documented default, lets the user switch
convention, and labels output with the convention in use and its source. The
fixture dataset carries vectors for each supported convention, so a convention
switch is testable, not cosmetic.

## 4. In scope, and explicitly out

**In scope:**

1. **Long Count ± distance numbers.** An anchor Long Count plus one or more
   distance numbers, computed forward and back, chainable. The core job.
2. **Full-date expansion.** From a Long Count, derive the Calendar Round
   (Tzolk'in + Haab), Lord of the Night, and the western date under the chosen
   correlation.
3. **Step-by-step working.** Every computation can show its derivation. This is
   the Round 2 transparency requirement surfaced as a product feature, not a
   debug mode.
4. **Calendar Round → candidate Long Counts.** Given a Calendar Round, possibly
   partial, list the candidate Long Counts within a chosen window. Secondary to
   the verification job but in scope.

**Explicitly out (non-goals):**

- **Glyph imagery and OCR.** No rendering of glyph images, no reading
  photographs of inscriptions, no glyph recognition. Input and output are
  textual notation only.
- **Corpus and site database.** No managing of inscriptions, monuments, sites
  or artifacts. The tool computes dates; it does not curate a corpus.
- **Parser/DX machinery as features.** Streaming parser APIs, AST visitor
  utilities, grammar visualisation, performance benchmarks — parser-internals
  work is maintenance, tracked in the maintenance backlog, and never competes
  with product scope. (This is the documented failure mode this spec exists to
  prevent; several of these are open issues on `maya-calculator-parser` today.)

**Left open (explicitly undecided, not a non-goal):** astronomy features beyond
fixture cross-checks (eclipse tables, Venus almanac, event prediction). Drew
declined to rule these out when asked with full context, so a future request
here is a product conversation, not an automatic refusal. Astronomy as a
*verification source* is already in scope via section 3.

## 5. Interfaces

**Product surfaces** (carry user-facing promises):

- **The web app.** A browser page where the epigrapher types dates and distance
  numbers and sees results with working. No install step. This is the surface
  the Round 1 user actually reaches.
- **The published libraries.** The npm packages (`@drewsonne/maya-dates` and
  the layer stack) as a supported public API that third parties may build on,
  with the compatibility promises that implies. This surface fails the
  epigrapher test — it serves a deliberate second audience, third-party
  developers, not the Round 1 user. Kept as a product surface by explicit
  decision (2026-09-13), with that trade-off recorded rather than hidden.

**Implementation details** (serve the product, carry no promises, may change
freely so long as product surfaces keep working):

- A CLI, if one exists — scripting convenience, not a supported surface.
- Shareable/computation-encoding URLs — not a promised feature.
- Internal package boundaries, parser structure, build tooling.

## 6. The success test

The app reproduces every citation-backed fixture vector — winal rollover,
correlation constants, convention switches, the lot — with zero failures.

Observable, binary, and in Drew's control: the fixture suite (this repo's
dataset) runs against the app surface, not just the libraries, and passes
clean. A wrong answer anywhere in the sourced dataset means the product has
not yet worked, whatever else has shipped.

Unprompted use by a working epigrapher was considered and would be welcome
evidence, but it is not the test; the test chosen is the one that can be run.
