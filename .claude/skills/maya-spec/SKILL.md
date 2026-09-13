---
name: maya-spec
description: Interview Drew into a product spec for the Maya date calculator and write it to docs/product/. Use before planning work, or whenever what the product is for has drifted out of view.
---

# Spec the product

This is an interview, not a generator. You do not know what the product is for, and guessing produces a spec that ratifies whatever is already being built.

The failure mode this skill exists to prevent is documented: the app an academic would use has gone untouched for years while the open issues on the libraries were streaming parser APIs, AST visitor utilities, grammar visualisation and benchmarks. All defensible work. None of it anything a Maya epigrapher would notice.

## Method

Ask in rounds, one topic per round, and write each answer into the spec before asking the next. Never draft the whole document and ask for corrections — that anchors him on your guesses.

Rounds, in order:

1. **Who uses this, and for what task?** Push until the answer is a person doing a specific thing, not a category. "Academic researchers" is not an answer. "An epigrapher reading a damaged inscription who needs the candidate dates for a partial Calendar Round" is.
2. **What must it get right, above everything?** One thing. If two are named, ask which survives if the other is wrong.
3. **What does correct mean, and who adjudicates?** Which published sources are ground truth. Which correlation constant is the default and whether the user can change it. What happens on input the literature itself disagrees about.
4. **In scope, and explicitly out.** Non-goals are mandatory and must be specific enough to refuse a future feature request.
5. **Interfaces.** What a user touches: a web UI, a CLI, a library import, a shareable URL. For each, whether it is a product surface or an implementation detail.
6. **The success test.** One observable event that means it worked. "A named epigrapher used it for real work without being asked to" is a test. "It feels useful" is not.

## Output

`docs/product/prd.md` with those six sections in that order, and `docs/product/non-goals.md` if the non-goals list runs long enough to stand alone.

Every requirement is written as an outcome, never as a technology. "Parsing is incremental" is not a requirement; "a 200-line inscription document re-renders without a visible pause while typing" is.

## The epigrapher test

For each requirement, state whether you could explain to a working epigrapher why they care. If you cannot, mark it `dx-only` and move it out of the PRD into `docs/product/maintenance-backlog.md`. Do this out loud, per requirement, and do not skip items that look obviously worthwhile — developer-experience work is exactly what gets waved through.

A `dx-only` item is not condemned. It is simply not product scope, and it does not compete for attention with product scope.

## Rules

- Never write a requirement Drew did not state or confirm. If a gap needs filling, ask.
- One user job per requirement. A requirement serving two jobs is two requirements.
- If a round's answer contradicts the existing spec or an ADR, stop and say so. Do not silently reconcile.
- If he answers a round with an implementation ("use a streaming parser"), record the underlying need and note the implementation as a candidate, not a requirement.
- Do not open source files during the interview. What the code does is not evidence of what the product is for.
