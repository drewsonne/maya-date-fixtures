# Maintenance backlog (dx-only)

Items here failed the epigrapher test in `prd.md`: no working epigrapher could
be told why they care. They are not condemned — they are maintenance, and they
do not compete with product scope for attention.

From the open issues on `maya-calculator-parser` (per PRD non-goals,
2026-09-13):

- Streaming parser API (#26)
- AST visitor utilities (#24)
- Grammar visualisation (#25)
- Performance benchmarks (#22)
- Barrel-export / deep-import migration (#17, and maya-dates #142) — in flight
  on the board; finishing carried work is fine, but it is maintenance, not
  product progress.
- Formal grammar specification (#18) — an engineering aid to parser
  correctness; product-relevant only insofar as it prevents wrong parses, which
  the fixture suite tests directly.

Dependency-bump PRs (19 on maya-calculator-parser, 15 on maya-calculator) are
likewise maintenance.
