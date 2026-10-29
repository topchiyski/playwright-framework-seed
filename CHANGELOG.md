# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-10-29

Turns the repository into a seed project: start your own suite with one command.

### Added

- `npm run init:project -- --name <pkg> [--yes]`: removes the demo and installs a working skeleton (home page object, health-check API client, one UI and one API smoke test, placeholder config) from `templates/skeleton/`. Dry run by default; removes itself afterwards.
- Local sandbox app in the skeleton, started by Playwright, so a new project passes its tests offline on day one.
- `webServer` profile setting: Playwright starts the app under test before the tests.
- `testIdAttribute` profile setting (was hard-coded to SauceDemo's `data-test`).
- `authenticate` application fixture: the app's sign-in steps; `tests/auth.setup.ts` is now app-agnostic.
- `config/personas.ts` with `USER_ROLES`, `AUTH_ROLES` and a configurable `DEFAULT_ROLE`.
- GitHub Actions: `ci.yml` (verify on Node 22 and 26, full suite, report upload) and `seed-init.yml` (tests the init path). Dependabot for npm and GitHub Actions.
- Docs: [Make it yours](docs/make-it-yours.md), [the application under test](docs/app.md), [ADR-0007](docs/adr/0007-separate-framework-from-application.md), first-run troubleshooting, framework-vs-application ownership table, CI reference.
- MIT license.

### Changed

- Minimum Node.js raised from 20 to 22; Node 20 reached end-of-life on 2026-04-30.
- Fixtures split into `base.fixtures.ts` (framework) → `app.fixtures.ts` (application) → `index.ts`; `page.fixtures.ts` and `api.fixtures.ts` are gone.
- Demo data builders moved from `@utils/data-factory` to `@utils/builders`; `data-factory` keeps the app-independent `uniqueId()` and `isoDate()`.
- Empty environment variables now count as unset, so blank CI secrets fall back to `.env`.
- Demo files are marked with a `// Demo app` comment; application facts moved from the framework docs, `CLAUDE.md` and Claude rules into `docs/app.md` and `.claude/rules/app.md`.
- `.claude/settings.json` holds a team allowlist only; personal permissions belong in the git-ignored `settings.local.json`.

### Security

- Pinned `dompurify` to 3.4.17 via npm `overrides`. Allure 3.22.1 depends on 3.4.16, which is affected by GHSA-cg2g-xh64-v4q7, GHSA-mrv2-3pqr-j5jr and GHSA-c6gr-qvv4-5v3f.
  - **Partial fix:** this patches the npm-installed copy (`npm audit` is clean), but the Allure HTML report viewer is pre-built by Allure with DOMPurify 3.4.16 inside it, so generated reports still contain the vulnerable version. Treat Allure reports as local artifacts and do not publish them until Allure ships a release built with DOMPurify ≥ 3.4.17.
  - Remove the override after upgrading to that Allure release.

## [1.0.0] - 2026-10-29

### Added

- Playwright + TypeScript framework with `setup`, `e2e-chromium`, `e2e-firefox` and `api` projects.
- Zod-validated, layered configuration for `qa`, `staging` and `prod` (`src/config/env.ts`, `config/`).
- Per-persona saved-session authentication (`standard`, `performanceGlitch`) with a `role` fixture option.
- Page objects and components for SauceDemo login, inventory, cart and checkout.
- Contract-validated Restful-Booker API clients with `toHaveStatus` and `toMatchSchema` matchers.
- `seedCart`, `createBooking` and a LIFO `cleanup` registry for test data.
- Automatic skipping of `@destructive` tests where the environment disallows them.
- HTML, JUnit and Allure reporting; traces, screenshots and video on failure.
- ESLint rules enforcing no hard waits, no assertions in page objects, and fixture-only imports in specs.
- Claude Code configuration: `CLAUDE.md`, path-scoped rules, a Prettier hook, and permission deny rules for secrets.
- Documentation: README, getting-started tutorial, framework guide, how-to guides, reference, ADRs, contributing guide, and a docs link checker.

### Fixed

- Side-menu locators now target buttons; SauceDemo renders Logout, All Items and Reset App State as buttons.
- `allure:generate` no longer fails with `EPERM` on Windows when a previous report exists.
- Allure results no longer accumulate across runs.
- Line endings are pinned to LF via `.gitattributes` so `format:check` passes on Windows checkouts.
