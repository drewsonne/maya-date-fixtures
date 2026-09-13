# Repository state

Facts about the project's own repositories, verified against GitHub rather than recalled.
Planning notes written before this date carry figures that no longer hold; where the two
disagree, this file is the record.

## The parser repository was renamed

`drewsonne/maya-date-parser` is the former name of `drewsonne/maya-calculator-parser`
(repository id 282427072). Requests to the old path 301-redirect to the new one. The local
checkout at `~/Development/maya-date-parser` still carries the old remote URL and is
several years behind.

Source: GitHub REST API, `GET /repos/drewsonne/maya-date-parser`
Checked: 2026-09-13

## Open pull requests total 34, not 53

| repo | open PRs | composition | oldest |
|---|---|---|---|
| `maya-dates` | 0 | — | — |
| `maya-calculator` | 15 | 15 Dependabot | #10, 2020-03-16 |
| `maya-calculator-parser` | 19 | 10 Dependabot, 8 Copilot, 1 Drew (#15) | #5, 2021-04-01 |

`maya-dates` carried 19 Dependabot pull requests in earlier counts and now carries none;
they were resolved on or before 2026-09-13. The mechanical-bump backlog is 25, not 49, and
the unreviewed Copilot backlog is 8, not 11.

Source: GitHub REST API, `GET /repos/drewsonne/{repo}/pulls?state=open`
Checked: 2026-09-13

## Open issues total 14

`maya-dates` #142 (deprecate deep imports); `maya-calculator` #27 (evaluate calculator
consolidation strategy); `maya-calculator-parser` #16-#27, a twelve-issue epic titled
"Stabilize Parser & Upgrade to maya-dates >= 1.3.0".

Source: GitHub REST API, `GET /repos/drewsonne/{repo}/issues?state=open`
Checked: 2026-09-13

## A fifth Maya repository exists

`drewsonne/maya-artifact-database` (Python, last pushed 2020-01-25, no open issues) is not
referenced in any architecture document. Its relationship to the four-layer stack is
undetermined.

Source: GitHub REST API, `GET /users/drewsonne/repos`
Checked: 2026-09-13
