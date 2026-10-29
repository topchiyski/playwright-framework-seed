# 0001. Authenticate via saved sessions, one login per persona per run

- Status: Accepted
- Date: 2026-10-29

## Context

Almost every UI test needs a logged-in user. Logging in through the UI at the start of each test adds several seconds per test, multiplies load on the login page, and makes every test fail when only login is broken — burying the real cause under dozens of failures.

Tests also need several personas (a normal user, a deliberately slow user, a logged-out visitor).

## Decision

- A dedicated `setup` Playwright project (`tests/auth.setup.ts`) logs in **once per persona per run** through the real UI and saves the browser storage state to `.auth/<persona>.json`.
- UI projects depend on `setup` and start each test in a fresh context loaded from the saved state.
- A `role` fixture option selects the persona (`test.use({ role })`); `'anonymous'` provides an empty state for testing the login page itself.
- Specs never log in through the UI. The login flow is covered explicitly by `login.spec.ts`.

## Consequences

- UI tests start authenticated in milliseconds; a broken login shows up as a single `setup` failure.
- Adding a persona is configuration: a username plus an entry in `AUTH_ROLES`.
- Saved sessions contain live cookies, so `.auth/` is git-ignored and blocked from agent reads.
- A session that expires during a very long run would fail later tests. The current suite runs in well under a minute; if it grows to long runs, session freshness needs revisiting.
