# The application under test

Everything specific to the application this suite tests lives on this page; the rest of the documentation describes the framework and applies to any application. This repository ships with a **demo**: the [SauceDemo](https://www.saucedemo.com) web shop and the [Restful-Booker](https://restful-booker.herokuapp.com) API. `npm run init:project` replaces this page with a template to fill in for your own application — see [Make it yours](make-it-yours.md).

## Targets

| Part | URL                                    | Tested by                         |
| ---- | -------------------------------------- | --------------------------------- |
| UI   | `https://www.saucedemo.com`            | `tests/e2e/` (Chromium + Firefox) |
| API  | `https://restful-booker.herokuapp.com` | `tests/api/`                      |

All three environment profiles (`qa`, `staging`, `prod`) point at these URLs; the profiles demonstrate the mechanism. Configured in `config/default.ts`.

## Personas

Defined in `config/personas.ts`; usernames in `config/default.ts`; one shared password from `UI_PASSWORD`.

| `role`              | SauceDemo user            | Saved session | Notes                                  |
| ------------------- | ------------------------- | ------------- | -------------------------------------- |
| `standard`          | `standard_user`           | yes (default) | Normal behaviour                       |
| `performanceGlitch` | `performance_glitch_user` | yes           | Deliberately slow responses            |
| `lockedOut`         | `locked_out_user`         | no            | Login is rejected; used in login tests |

## App-specific fixtures and data

Defined in `src/fixtures/app.fixtures.ts`:

| Fixture                              | Purpose                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `authenticate`                       | Logs in on the login page and waits for the inventory page               |
| `loginPage` … `checkoutCompletePage` | Page objects for login, inventory, cart and the three checkout steps     |
| `seedCart(...products)`              | Writes SauceDemo's `cart-contents` localStorage key, then opens the cart |
| `authApi`, `bookingApi`              | Restful-Booker clients; `bookingApi` is authenticated                    |
| `apiToken` (worker)                  | Admin token from `POST /auth`, sent as a `Cookie: token=…` header        |
| `createBooking(overrides?)`          | Creates a booking and registers its deletion                             |

Test data:

- `src/utils/catalog.ts` — the six products with ids, names and prices, plus `TAX_RATE` (8%).
- `src/utils/builders.ts` — `buildBooking()` and `buildCheckoutInfo()` with unique names.
- `src/utils/money.ts` — parses and formats `$` amounts as SauceDemo renders them.
- `testIdAttribute` is `data-test`, the attribute SauceDemo puts on its elements.

## Known quirks

Behaviours of the demo applications, not bugs in the framework. Tests assert them as they are.

- SauceDemo's side-menu entries (All Items, Logout, Reset App State) are **buttons**, not links; only About is a link.
- Restful-Booker answers a successful `DELETE` with **201**, a bad login with **200** and `{ "reason": "Bad credentials" }`, and a delete of a missing booking with **405**.
- Both services are public and shared: Restful-Booker contains other people's data and resets periodically. Tests use unique names and never assume an empty system.
- If these sites are slow or down, demo tests fail through no fault of yours. Ad blockers and proxies that filter browser traffic (for example AdGuard filtering `firefox.exe`) can also stall page loads — see [getting started](getting-started.md#if-the-first-run-fails).

## Demo files

Every demo source file starts with the comment `// Demo app (SauceDemo + Restful-Booker)`. The exact list that `init:project` removes or replaces is at the top of `scripts/init-project.mjs`.
