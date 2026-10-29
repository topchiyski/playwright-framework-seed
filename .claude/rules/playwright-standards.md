---
paths:
  - 'src/pages/**/*.ts'
  - 'src/fixtures/**/*.ts'
  - 'tests/**/*.ts'
---

# Page Objects, fixtures & specs

## Page Objects (`src/pages/`)

- Page: extend `BasePage`; set `path` and `readyLocator`; expose locators as `readonly` fields and intent-level async actions. Register a fixture for it in `src/fixtures/app.fixtures.ts`.
- Component: extend `BaseComponent`; derive every locator from `root` so it works inside lists. Reuse an existing component when markup is shared across pages.
- Return data or `this`; leave assertions to specs. Reads that may race UI updates belong in specs as web-first assertions (`toHaveText`, `toHaveCount`), not as `innerText()` comparisons.
- Locator order: `getByRole` → `getByPlaceholder`/`getByLabel` → `getByText` → `getByTestId` (attribute = `testIdAttribute` setting). Use CSS/XPath only for structural hops with no accessible handle.
- Synchronise on conditions: `readyLocator.waitFor()`, `expect(page).toHaveURL(page.urlPattern)`, locator state. `waitForTimeout`, `force: true` and `networkidle` fail lint.
- Locator broke? Read `test-results/<test>/error-context.md` (aria snapshot of the failing page) before guessing a new locator.

## Fixtures (`src/fixtures/`)

- `base.fixtures.ts` and `index.ts` are framework: no page objects, clients or app names there. App fixtures go in `app.fixtures.ts`, which extends `base.fixtures.ts`.
- `app.fixtures.ts` must provide `authenticate(credentials) → Promise<BasePage>` (sign in, return the landing page's `waitUntilReady()`); `tests/auth.setup.ts` uses it.

## Specs (`tests/`)

- Import `{ test, expect, TAG }` from `@fixtures/index`.
- Persona: `test.use({ role: '<persona>' })`; logged out: `test.use({ role: 'anonymous' })`. Personas: `config/personas.ts`.
- Set up state that is not under test without the UI (API calls, app storage) via fixtures; anything a test creates → `cleanup.register(label, fn)` right after creating it.
- Expected values come from constants/builders, never hard-coded in specs. Unique data via `@utils/data-factory`.
- Tags: `{ tag: [TAG.smoke | TAG.regression | TAG.contract | TAG.destructive] }` — npm scripts grep on them. Every data-mutating test carries `TAG.destructive` (auto-skipped in prod).
- Data-driven cases: a typed array + `for … of` generating one `test()` per case.
