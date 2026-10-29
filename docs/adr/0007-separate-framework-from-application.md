# 0007. Separate framework from application code; one-command project init

- Status: Accepted
- Date: 2026-10-29

## Context

The repository is used as a seed: colleagues start their own test suites from it. Originally, demo-specific details were spread through framework files — page objects and persona names inside the fixture files, demo payload builders inside the shared data factory, the login flow inside `auth.setup.ts`, SauceDemo's test-ID attribute in `playwright.config.ts`. Starting a new project meant guessing which code to delete, and later framework improvements could not be taken from the seed without conflicts.

## Decision

- Every file is owned either by the **framework** or by the **application under test** (table in the [framework guide](../framework-guide.md#framework-and-application-code)). Demo files carry a `// Demo app` marker on their first line.
- Two explicit hand-over points connect them: `src/fixtures/app.fixtures.ts` (page objects, clients, data helpers, and an `authenticate` fixture with the app's sign-in steps) and `config/` (URLs, personas in `personas.ts`, `testIdAttribute`, optional `webServer`).
- Fixtures are layered `base.fixtures.ts` (framework) → `app.fixtures.ts` → `index.ts` (framework guards).
- `npm run init:project` deletes the demo and installs a skeleton from `templates/skeleton/`, including a local sandbox app that Playwright starts via `webServer`, so a new project passes `verify` and its tests immediately and offline. The script removes itself afterwards.
- A CI workflow (`seed-init.yml`) runs the init on every change to the seed and tests the result.

## Consequences

- Starting a project is one command plus configuration; nobody has to know which demo files to remove.
- Framework files are identical across projects, so seed updates can be diffed and applied file by file.
- The demo stays in the seed as the reference implementation of every pattern.
- The skeleton templates are not linted or type-checked in place (they only compile once copied); the `seed-init` workflow covers them instead.
