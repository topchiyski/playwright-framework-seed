# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Minimum Node.js raised from 20 to 22; Node 20 reached end-of-life on 2026-04-30.

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
