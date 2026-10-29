# Application under test (demo)

Human-readable version: `docs/app.md`. `npm run init:project` replaces this file with a template.

- Targets: UI SauceDemo `https://www.saucedemo.com`; API Restful-Booker `https://restful-booker.herokuapp.com`. Both public and shared — never assume an empty system; use unique data.
- Personas (`config/personas.ts`): `standard` (default), `performanceGlitch` (slow), `lockedOut` (cannot sign in). All share `UI_PASSWORD`.
- `testIdAttribute` is `data-test`.
- App fixtures (`src/fixtures/app.fixtures.ts`): `authenticate`, page objects (`loginPage` … `checkoutCompletePage`), `seedCart(...products)` (writes `cart-contents` localStorage, lands on cart), `authApi`, `bookingApi`, worker `apiToken`, `createBooking()` (auto-cleanup).
- Expected values: `PRODUCTS`, `ALL_PRODUCTS`, `TAX_RATE` from `@utils/catalog`; money text via `formatMoney` (`@utils/money`); payloads via `buildBooking()` / `buildCheckoutInfo()` (`@utils/builders`).
- SauceDemo side-menu entries (All Items, Logout, Reset App State) are `button`s; only About is a `link`.

<!-- 2026-10-29: Triggered by logout spec timing out in both browsers on getByRole('link', {name:'Logout'}). Outcome: switched to role=button, 6/6 repeat runs green. Prune when: SauceDemo menu markup changes or SideMenuComponent is removed. -->

- Restful-Booker quirks (assert, don't "fix"): DELETE success = `201`; bad credentials on `POST /auth` = `200` + `{ reason: 'Bad credentials' }`; DELETE of a missing id = `405`; auth via `Cookie: token=<t>`. Unauthorized calls: `bookingApi.withToken(undefined)`.

<!-- 2026-10-29: Observed against live restful-booker.herokuapp.com during initial build; all 10 API specs green. Prune when: API target changes. -->

- Local Firefox runs stalling on `page.goto` while Chromium passes = a traffic filter (e.g. AdGuard hooking `firefox.exe`) on the machine, not a test bug.

<!-- 2026-10-29: Triggered by 20 Firefox-only goto timeouts; probe showed pending requests to injections.adguard.org. Same failure on the previous commit, so not code. Prune when: no longer reproducible. -->
