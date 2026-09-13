---
name: maya-review
description: Review a pull request on the Maya date project against its acceptance criteria, layer rules and fixture integrity before merge. Use on agent-authored and hand-written PRs alike, especially any touching calendar arithmetic.
---

# Review a pull request

The purpose is to make a merge decision defensible without reading every line. Eleven agent-authored pull requests once sat unmerged on this project for eight months because nobody could face reviewing them — the cost of review, not the cost of writing code, is what actually limits throughput here.

So this review is mechanical first and judgement second. The mechanical checks either pass or the PR is not ready, and no amount of reading compensates for one of them failing.

## Mechanical checks

Run all of these before forming any opinion about the code.

1. **Fixture integrity.** No change to fixture files or expected values unless the PR's stated purpose is adding fixtures. A PR that changes an expected value while also changing implementation is rejected on sight, regardless of whether tests pass. Do not evaluate the reasoning offered for it.
2. **Scope.** Changed paths against the package's declared scope. Anything outside it is a finding.
3. **Contract.** Nothing listed in the package's contract has changed. Check exported signatures specifically, not just files.
4. **Layer direction.** No new import from a lower layer to a higher one. Presentation → parsing → operations → representation, inward only.
5. **Suite.** Full suite green on the branch, not just the tests the PR added. Check that a new test actually fails without the implementation — a test that passes either way is decoration.
6. **Acceptance criteria.** Walk each one by name and state met, not met, or unverifiable. An unverifiable criterion is a planning defect to record, not something to wave through.

Report these as a list with verdicts. If any fails, say which and stop — do not continue into code review to soften the result.

## Judgement

Only once the mechanical checks pass.

- **Is the arithmetic verifiable by inspection?** Prefer direct division to progressive subtraction. If you cannot confirm a calculation by reading it, say so — that is a finding even when the tests pass, because the next person will not be able to either.
- **Does anything here encode a decision nobody made?** A default value, a rounding convention, a chosen correlation constant, a Haab coefficient convention. These arrive silently in implementation and are the most expensive thing to discover later. Route each to `maya-record`.
- **Is the change the smallest one that satisfies the criteria?** Extra refactoring bundled in is not a bonus; it is unreviewable surface. Ask for it to be split.
- **Would an epigrapher notice this?** Not a blocker — plenty of necessary work is invisible to users. But if a PR is large and the answer is no, say so plainly.

## Output

One verdict, chosen explicitly: **merge**, **merge after named changes**, or **reject and re-plan**.

Then at most five findings, most serious first, each naming the file and line. Do not pad the list to look thorough — a review with one real finding and a merge verdict is a good review.

## Rules

- Never merge. State the verdict and let Drew merge.
- Never approve a PR whose package block cannot be found. Unattributed work has no criteria to check against.
- Do not comment on formatting, naming preference or style that a linter should own. If a linter should own it and does not, that is one finding: add the linter.
- A PR that is correct but unreviewable is not ready. Say that, rather than merging it because the tests are green.
- If reviewing reveals the plan was wrong rather than the code, say so and route it back to `maya-plan`. Do not fix a planning error by negotiating with the implementation.
