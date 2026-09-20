---
name: maya-orient
description: Load the current state of the Maya dates project (drewsonne/maya-*) — repo map, work in flight, blockers, and a few sized next actions. Use when picking the project back up or asking where things stand.
---

# Orient on the Maya dates project

Read-only. This skill builds a picture of where the project stands. It does not start work, write code, or create issues.

## 1. Check prerequisites

Run `gh auth status`. If `gh` is missing or unauthenticated, say so and stop — everything below depends on it. If the `project` scope is absent, note that the board section will be skipped and carry on.

## 2. Discover the repos

```
gh repo list drewsonne --limit 200 \
  --json name,description,primaryLanguage,pushedAt,isArchived \
  --jq '[.[] | select(.name | startswith("maya")) | select(.isArchived == false)]'
```

Identify the hub repo — the one containing `docs/STATE.md`. Check; do not guess.

## 3. Read the hub

- `docs/STATE.md` — the narrative of where things are.
- `docs/decisions/` — list the newest 5 filenames. Read one only if it bears on an open thread.
- `docs/roadmap.md`, if present.

## 4. Pull live work state

- Open issues per repo: `gh issue list --repo drewsonne/<name> --state open --json number,title,labels,updatedAt`
- Hierarchy, per ADR 0009: epics on the hub (`gh issue list --repo <hub> --label epic`), each with its story/task rollup — report in-flight work grouped by epic where the hierarchy exists.
- Board, if the scope allows: `gh project list --owner drewsonne`, then `gh project item-list <n> --owner drewsonne --format json`
- Recent activity: `git log --oneline -10` for a local clone, otherwise `gh api repos/drewsonne/<name>/commits --jq '.[0:10] | .[] | .commit.message'`

## 5. Report

Under ~250 words, four sections:

**Repo map** — one line each: name, what it does, language, last touched.

**In flight** — open PRs, branches ahead of main, anything at Status=In progress. If nothing is in flight, say so plainly.

**Blocked or waiting** — issues labelled `blocked`, or STATE.md items waiting on something external.

**Three things you could do next** — each with a size (XS/S/M/L), the repo it lives in, and one sentence on why it is worth doing now. Order by leverage, not by age. Include at least one XS or S option.

## Rules

- Report findings; do not infer progress from absence of evidence. "No commits in six weeks" is a fact. "The project has stalled" is a judgement — leave it out.
- If STATE.md is older than the newest commit, say the state file is stale and offer to regenerate it. Do not regenerate unprompted.
- Do not list every open issue. Past ~8, give the count and surface only what bears on the next actions.
- Do not open the calculator's source to explain what it does. Repo descriptions and STATE.md are enough for orientation.
- `correctness` work — wrong calendar maths — outranks features and chores when ordering next actions.
