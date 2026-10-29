# 0004. Two methods per API endpoint: raw and contract-validated

- Status: Accepted
- Date: 2026-10-29

## Context

API calls in tests serve two purposes. Sometimes the HTTP behaviour _is_ the subject — status codes, error bodies, authorization failures. More often the call is setup or read-back, where the test wants typed data and should fail loudly if the API returns something unexpected. A single method cannot serve both well: one that throws on non-2xx blocks negative tests, and one that returns raw responses pushes parsing and checking into every spec.

## Decision

Every endpoint gets two client methods:

- `xxxResponse()` returns the raw `APIResponse` without judgement.
- `xxx()` calls the raw method, requires a 2xx status, and validates the body against a **Zod schema** in `src/api/schemas/`, returning typed data or throwing `ApiError`.

Specs check status with the custom `toHaveStatus` matcher and schemas with `toMatchSchema`.

## Consequences

- Negative tests and contract tests use the raw method; everything else gets typed data in one line.
- Contract drift is reported at the call site with the exact field that changed.
- Each endpoint needs a schema. Schemas double as executable documentation of the API.
