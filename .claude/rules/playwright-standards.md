---
paths:
  - 'src/pages/**/*.ts'
  - 'src/fixtures/**/*.ts'
  - 'tests/**/*.ts'
---

# Page Objects, fixtures & specs

## Page Objects (`src/pages/`)

- Page: extend `BasePage`; set `path` and `readyLocator`; expose locators as `readonly` fields and intent-level async actions. Register a fixture for it in `src/fixtures/page.fixtures.ts`.
- Component: extend `BaseComponent`; derive every locator from `root` so it works inside lists. Reuse `ProductList`/`ProductCardComponent` for any product row (inventory, cart, checkout overview share markup).
- Return data or `this`; leave assertions to specs. Reads that may race UI updates belong in specs as web-first assertions (`toHaveText`, `toHaveCount`), not as `innerText()` comparisons.
- Locator order: `getByRole` → `getByPlaceholder`/`getByLabel` → `getByText` → `getByTestId` (`data-test`). Use CSS/XPath only for structural hops with no accessible handle.
- Synchronise on conditions: `readyLocator.waitFor()`, `expect(page).toHaveURL(page.urlPattern)`, locator state. `waitForTimeout`, `force: true` and `networkidle` fail lint.
- SauceDemo side-menu entries (All Items, Logout, Reset App State) are `button`s; only About is a `link`.

<!-- 2026-10-29: Triggered by logout spec timing out in both browsers on getByRole('link', {name:'Logout'}). Outcome: switched to role=button, 6/6 repeat runs green. Prune when: SauceDemo menu markup changes or SideMenuComponent is removed. -->

- Locator broke? Read `test-results/<test>/error-context.md` (aria snapshot of the failing page) before guessing a new locator.

## Specs (`tests/`)

- Import `{ test, expect, TAG }` from `@fixtures/index`.
- Persona: `test.use({ role: 'performanceGlitch' })`; logged out: `test.use({ role: 'anonymous' })`.
- Set up state that is not under test without the UI: `seedCart(...products)` (writes localStorage, lands on cart), `createBooking()` (API + auto-cleanup). Anything else a test creates → `cleanup.register(label, fn)`.
- Expected names/prices/ids/tax: `PRODUCTS`, `ALL_PRODUCTS`, `TAX_RATE` from `@utils/catalog`; money text via `formatMoney`. Unique data via `@utils/data-factory`.
- Tags: `{ tag: [TAG.smoke | TAG.regression | TAG.contract | TAG.destructive] }` — npm scripts grep on them. Every data-mutating test carries `TAG.destructive` (auto-skipped in prod).
- Data-driven cases: a typed array + `for … of` generating one `test()` per case (see `login.spec.ts`).
