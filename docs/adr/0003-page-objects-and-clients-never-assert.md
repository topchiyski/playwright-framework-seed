# 0003. Page objects and API clients never assert (lint-enforced)

- Status: Accepted
- Date: 2026-10-29

## Context

When page objects contain assertions, the same object cannot serve both positive and negative tests, and the expected behaviour of a test is hidden inside helper methods instead of being visible in the spec. Conventions written only in documentation erode over time.

## Decision

- Page objects (`src/pages/`) and API clients (`src/api/`) expose **locators, actions and data** only. They may wait for readiness conditions, and API clients may throw on contract violations, but they never call `expect`.
- All verification lives in specs, using Playwright's retrying web-first assertions.
- ESLint enforces it: importing `expect` or `test` from `@playwright/test` under `src/pages/` or `src/api/` is an error.

## Consequences

- Specs state their expectations explicitly and read as specifications.
- One page object supports any scenario, including error paths.
- Some specs repeat short assertion sequences; this repetition is preferred over hiding expectations.
