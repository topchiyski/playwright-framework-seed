# 0005. Seed test state without the UI; LIFO cleanup registry

- Status: Accepted
- Date: 2026-10-29

## Context

Tests need preconditions — items in a cart, an existing booking. Building them through the UI is slow and couples every test to screens it is not testing. Data left behind by tests pollutes shared environments and creates hidden dependencies between tests.

## Decision

- Preconditions that are not under test are created **directly**: through the API (`createBooking`) or the application's own storage (`seedCart` writes SauceDemo's cart into browser storage).
- A per-test `CleanupRegistry` (`cleanup` fixture) collects undo steps. They run after the test, **last-in-first-out**, **regardless of outcome**; every step runs even if one fails, and failures are reported together.
- Creation fixtures register their own cleanup, so the common path needs no extra code. Cleanup steps must be idempotent.
- Generated data uses unique values (`uniqueId`) so parallel workers and other users of shared systems never collide.

## Consequences

- Tests are faster and independent of order and parallelism.
- Seeding through app storage depends on an internal detail of SauceDemo (the `cart-contents` key). If the app changes it, `seedCart` must change — in one place.
- A test that creates data without registering cleanup leaks it; reviews check for this.
