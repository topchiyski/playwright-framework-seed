---
paths:
  - 'src/api/**/*.ts'
  - 'tests/api/**/*.ts'
  - 'src/fixtures/api.fixtures.ts'
  - 'src/fixtures/matchers.ts'
---

# API clients & API specs

- New endpoint: add a Zod schema in `src/api/schemas/`, then two client methods — `xxxResponse()` returning the raw `APIResponse` (status/negative tests) and `xxx()` calling `this.parse(response, Schema)` (enforces 2xx + contract, throws `ApiError`). Clients throw; specs assert.
- Status checks: `await expect(response).toHaveStatus(201)` (prints the body on failure). Contract checks: `expect(body).toMatchSchema(Schema)`.
- Type JSON as `unknown` before custom matchers: `const body: unknown = await response.json()`; then `Schema.parse(body)` for typed access.

<!-- 2026-10-29: Triggered by tsc "Property 'toMatchSchema' does not exist" — Playwright's MakeMatchers drops expect.extend matchers when T is any (IfAny branch in test.d.ts). Outcome: typing as unknown typechecks. Prune when: Playwright exposes custom matchers for any. -->

- Unauthorized calls: `bookingApi.withToken(undefined)`; the worker-scoped `apiToken` is reused across tests — never mint tokens per test.
- Restful-Booker quirks (assert these, don't "fix" them): DELETE success = `201`; bad credentials on `POST /auth` = `200` + `{ reason: 'Bad credentials' }`; DELETE on a missing id = `405`; auth via `Cookie: token=<t>`; requests need `Accept: application/json` (set on `apiRequest`).

<!-- 2026-10-29: Observed against live restful-booker.herokuapp.com during initial build; all 10 API specs green. Prune when: API target changes. -->

- Shared public backend: build payloads with `buildBooking()` (unique lastname) and create through `createBooking()` so teardown is registered.
