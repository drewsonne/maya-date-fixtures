# 0008. Outward-facing documentation is bilingual; maintainer documentation is not

- Status: proposed
- Date: 2026-09-13
- Depends on: 0006, 0007

## Context

Maya epigraphy is substantially a Spanish-language field. The inscriptions are in Mexico, Guatemala, Honduras, Belize and El Salvador; the institutions that hold and study them — INAH, IDAEH, UNAM, Universidad de San Carlos — work in Spanish; and a tool intended for academic research that exists only in English excludes a large part of its actual audience. `maya-dates` already cites Spanish-language and Spanish-derived sources, including Landa's *Relación de las cosas de Yucatán*, and carries a correlation constant named Martinéz-Hernando.

But "document everything in Spanish" conflates two audiences with opposite economics.

Maintainer documentation — the ADRs, the skills, the PRD — is read by the maintainer and by contributors to a TypeScript library, an ecosystem that operates in English. Translating it doubles the maintenance surface for close to no readership, and it degrades rather than degrades-gracefully: a translated ADR that falls behind its English original is worse than no translation, because someone will act on superseded reasoning in good faith.

Outward-facing documentation is the opposite. The fixtures dataset (0006) is the project's citable artifact, and its audience is precisely the Spanish-speaking research community. The app is used by epigraphers, not maintainers. Library READMEs are how anyone decides whether the project is worth their time.

There is also a distinction this project is well placed to get right and easy to get wrong. `maya-dates`' existing i18n is **orthographic**, not linguistic: modern Mayanist, modern variant, and older 16th-century spellings, each sourced. That axis is not the same as UI language, and the 16th-century spellings *are* largely the Spanish colonial tradition. Adding Spanish is new machinery on a new axis, not another locale file.

## Decision

`maya-dates` already ships a Docusaurus 3.9.2 site whose config carries an `i18n` block (`defaultLocale: 'en'`, `locales: ['en']`) and a `write-translations` script. Spanish is added there: `locales: ['en', 'es']`, then `npm run write-translations -- --locale es`. No new infrastructure.

Its documentation divides into two kinds, and the division decides the policy.

**Bilingual — hand-written prose, the pages that explain the domain:**

- `website/docs/intro.md`
- `website/docs/usage.md`
- `website/docs/domain-model.md`
- `website/docs/examples.md`
- `website/docs/julian-v-gregorian.md`
- `website/docs/spelling-variations.md`
- the repository `README`

**English only — generated output and developer-facing pages:**

- `website/docs/api/` and `website/docs/modules/` — produced by typedoc from the 86 TSDoc tags in `src/`. Translating these means translating source comments, which puts language drift inside the code, and a stale translated `@param` is a defect rather than a rough edge.
- `website/docs/architecture.md`, `design-patterns.md`, `api-overview.md`, `changelog.md` — read by people extending the library, not by people studying the calendar.
- `docs/development/**` and `docs/agents/**` — maintainer notes.

**Also bilingual, elsewhere:** the fixtures repository's `README` and schema documentation, including the definitions of `provenance`, `attested`, `derived` and `unverified` — field *keys* stay English, their documentation does not. Each other library's `README`. The app's interface and tutorial content.

**English only, elsewhere:** ADRs including this one; the `SKILL.md` files, which are instructions to a coding agent; the PRD, the plan and `STATE.md`; code comments, commit messages, pull requests and issues.

The two most valuable pages to translate are `julian-v-gregorian.md` and `spelling-variations.md`. The first is where the proleptic-calendar question is explained, which is the largest source of error in the domain. The second explains the orthographic traditions — and the 16th-century spellings the library supports *are* substantially the Spanish colonial tradition, from Landa. Explaining that distinction in Spanish, to the audience whose scholarly inheritance it is, is closer to a contribution than to a translation.

**Domain terminology is sourced, not translated.** A Spanish term for a calendrical concept is taken from published Spanish-language Mayanist literature and cited, exactly as a fixture value is. *Cuenta Larga* is established. Others — the Spanish rendering of Calendar Round, Distance Number, Lord of the Night — are checked against the literature before use, not rendered by a translator or by an English speaker's best guess. The primary authority is Kettunen & Helmke's *Introducción a los Jeroglíficos Mayas*, the Spanish edition of the handbook whose authors `maya-dates` already cites for orthography; a glossary lives in the hub at `docs/research/terminologia-es.md` with a citation per term.

Spanish means Latin American Spanish as used in Mexican and Guatemalan scholarship, not Peninsular.

## Consequences

**Easier.** The artifact intended to be cited can be cited by the people most likely to cite it. The app becomes usable by researchers in the countries the inscriptions are in. A sourced bilingual glossary is itself a small scholarly contribution, and it forces precision: a concept with no established Spanish term is a concept worth asking an epigrapher about.

**Harder.** Every change to a bilingual document is two changes. The scope above is deliberately narrow because a solo maintainer cannot keep more than this in step, and a stale translation is a liability rather than a partial success. CI should fail a pull request that edits one language of a bilingual pair without the other — the policy is unenforceable by intention alone.

Terminology is a research task on the critical path, not a formatting pass. It cannot be completed by anyone who does not read the literature, which means it is either Drew's work or a question for a collaborator.

**Now has to be true elsewhere.** Six prose pages is the standing translation debt for `maya-dates`, and it grows whenever a new prose page is added — the CI check has to cover `website/i18n/es/` completeness, not only pairs that already exist. A new English page with no Spanish counterpart should fail, or the site will silently serve English pages to a Spanish reader with no indication anything is missing.

The app needs a UI-language layer, which does not exist today; this is separate from and additional to the orthographic locales in `maya-dates`, and the two are independently selectable — a Spanish interface showing modern Mayanist orthography is a legitimate combination, as is an English interface showing 16th-century spellings. `docs/research/terminologia-es.md` is created before any Spanish user-facing text is written, and no Spanish term appears in shipped output until it has a citation there.
