# 0006. Public demo applications as test targets

- Status: Accepted
- Date: 2026-10-29

## Context

The framework was built without a specific application under test. It needed realistic targets that exercise a UI flow with login, state and multi-step forms, plus an API with token authentication and full create/read/update/delete, and that anyone can run without provisioning infrastructure.

## Decision

- UI: **SauceDemo** (`https://www.saucedemo.com`) — login with several personas, inventory, cart and checkout.
- API: **Restful-Booker** (`https://restful-booker.herokuapp.com`) — token auth and full CRUD on bookings.
- All three environment profiles point at these targets; the profiles demonstrate the mechanism and are ready to be repointed.

## Consequences

- The suite runs anywhere with internet access and the public demo credentials.
- Both services are shared and outside our control: they may be slow, reset data, or change markup. Tests use unique data, never assume an empty system, and assert the services' quirks as-is (documented in [the application under test](../app.md#known-quirks)).
- Moving to a real product means replacing URLs, credentials, page objects, schemas and catalog data; the framework layers (fixtures, configuration, cleanup, reporting) stay unchanged.
