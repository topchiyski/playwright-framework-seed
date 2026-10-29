---
paths:
  - 'src/api/**/*.ts'
  - 'tests/api/**/*.ts'
  - 'src/fixtures/**/*.ts'
---

# API clients & API specs

- New endpoint: add a Zod schema in `src/api/schemas/`, then two client methods — `xxxResponse()` returning the raw `APIResponse` (status/negative tests) and `xxx()` calling `this.parse(response, Schema)` (enforces 2xx + contract, throws `ApiError`). Clients throw; specs assert. Register the client as a fixture in `app.fixtures.ts`, built on `apiRequest`.
- Status checks: `await expect(response).toHaveStatus(201)` (prints the body on failure). Contract checks: `expect(body).toMatchSchema(Schema)`.
- Type JSON as `unknown` before custom matchers: `const body: unknown = await response.json()`; then `Schema.parse(body)` for typed access.

<!-- 2026-10-29: Triggered by tsc "Property 'toMatchSchema' does not exist" — Playwright's MakeMatchers drops expect.extend matchers when T is any (IfAny branch in test.d.ts). Outcome: typing as unknown typechecks. Prune when: Playwright exposes custom matchers for any. -->

- Auth tokens are worker-scoped fixtures, reused across tests — never mint tokens per test.
- Data-creating endpoints get a creation fixture that registers its own deletion; deletion must be idempotent (succeed if already gone).
