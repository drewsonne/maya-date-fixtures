# 0003. The parser exposes a public API and stops deep-importing

- Status: proposed
- Date: 2026-09-13
- Depends on: 0002

## Context

`@drewsonne/maya-calculator-parser` 1.0.3 is published to npm. Its `package.json` sets `main: src/index.ts`. That file is **0 bytes**. The package exports nothing and cannot be consumed by anything, including the app it is named for.

This is why the GUI still carries its own regex `PatternMatcher`: not neglect, but the only thing that could work. Pull request #15, "Add public parse API", has been open since 2025-07-23.

Two further defects in the same surface. `main` points at TypeScript source rather than built output, so consumers would need a TypeScript toolchain and matching config to use the package at all. And the parser reaches into the library by deep import — `@drewsonne/maya-dates/lib/lc/long-count`, `/lib/wildcard`, `/lib/cr/calendar-round` — which is precisely what `maya-dates` issue #142 proposes to deprecate. Landing #142 as things stand breaks the parser.

Behind that surface the parser is sound: a layer-0 lexical tokenizer, layer-1 Long Count and Calendar Round tokens, layer-2 operation tokens, layer-3 full dates, with a spec file per layer. The work is done. It is unreachable.

## Decision

`src/index.ts` exports a documented parse API as the package's only supported entry point: a `parse` function from text to the layer-3 AST, the token types a consumer needs to walk the result, and nothing else. Internal layer files are not part of the contract.

`main` and `types` point at built output (`lib/`), not source, matching how `@drewsonne/maya-dates` already publishes.

All imports of `@drewsonne/maya-dates` move from `/lib/...` deep paths to the package root, which already exports every symbol the parser uses through its barrel. This resolves the collision with `maya-dates` #142 rather than deferring it, and #142 can then land without breaking anything.

This decision lands before 0004 and 0005. Nothing downstream can consume the parser until it exports something.

## Consequences

**Easier.** The app can delete `PatternMatcher` and take parsing from the package built for it. `maya-dates` #142 becomes safe to close. The parser's existing four-layer test suite starts protecting something reachable.

**Harder.** Choosing the public surface is a real design decision, not a mechanical one: everything exported becomes a semver commitment, and the layer-0 to layer-3 token types are currently internal shapes that were never designed to be a contract. Export too much and every internal refactor is a breaking change.

**Now has to be true elsewhere.** Publishing built output means the parser needs a working build and a `files` allowlist in `package.json`. The version bump is a minor release, not a patch — the package's behaviour changes from "exports nothing" to "exports an API", and consumers should be able to depend on it by range.
