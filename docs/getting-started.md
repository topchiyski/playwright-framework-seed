# Getting started: write your first test

This tutorial takes you from a fresh clone to a new passing UI test. It takes about 15 minutes. You will learn the three things every spec in this project relies on: the shared `test` import, page objects, and web-first assertions.

You will write this test: _"a product added from the inventory shows up in the cart"_.

## 1. Set up and run the suite

```bash
npm ci
npm run install:browsers
cp .env.example .env
npm test
```

Wait for `58 passed`. A green run proves your machine, browsers and credentials are ready before you change anything.

### If the first run fails

| Symptom                                                       | Likely cause and fix                                                                                                                                                                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Invalid test configuration … is required`                    | `.env` is missing — run `cp .env.example .env`.                                                                                                                                                                                             |
| `Executable doesn't exist` for a browser                      | Browsers not installed — run `npm run install:browsers`.                                                                                                                                                                                    |
| Many tests fail with `page.goto: Timeout` in one browser only | Something on your machine filters that browser's traffic — e.g. AdGuard or a corporate proxy hooking `firefox.exe`. Exclude Playwright's browsers (in `%LOCALAPPDATA%\ms-playwright` on Windows) from filtering, or pause it while testing. |
| Many tests fail with timeouts in every browser                | The public demo sites (SauceDemo, Restful-Booker) are slow or down. Check them in a normal browser and retry later; `npm run test:smoke` is a quick probe.                                                                                  |

## 2. Create the spec file

Create `tests/e2e/my-first.spec.ts`:

```ts
import { PRODUCTS } from '@utils/catalog';
import { expect, TAG, test } from '@fixtures/index';

test('added product appears in the cart', { tag: [TAG.regression] }, async ({ inventoryPage, cartPage }) => {
  // TODO
});
```

Three things to notice:

- `test` and `expect` come from **`@fixtures/index`**, never from `@playwright/test`. The project's `test` already knows how to log in, clean up data and skip unsafe tests in production. (Importing from `@playwright/test` is a lint error.)
- `inventoryPage` and `cartPage` are **fixtures**: ready-made page objects. You ask for them by name and Playwright creates them for you.
- The browser is **already logged in** as the standard user. You never write login steps; see [how authentication works](framework-guide.md#authentication-log-in-once-per-persona).

## 3. Act through the page objects

Replace `// TODO` with:

```ts
await inventoryPage.goto();
await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
await inventoryPage.header.openCart();
await cartPage.waitUntilReady();
```

- `goto()` opens the page and waits until it is ready to use. No sleeps needed.
- `PRODUCTS` (from `src/utils/catalog.ts`) holds the known product names and prices, so tests never hard-code strings like `'Sauce Labs Bike Light'`.
- `header` is a **component** shared by every logged-in page; it owns the cart link, the badge and the menu.
- `waitUntilReady()` waits for the cart page after the click navigated there.

## 4. Assert with web-first assertions

Add the checks below the actions:

```ts
await expect(cartPage.items.names).toHaveText([PRODUCTS.bikeLight.name]);
await expect(cartPage.header.cartBadge).toHaveText('1');
```

`expect(locator).toHaveText(...)` **retries until the condition holds** (up to the expect timeout). That is why the framework never needs `waitForTimeout`: you describe the end state and Playwright waits for it.

## 5. Run it

```bash
npx playwright test tests/e2e/my-first.spec.ts --project=e2e-chromium
```

You should see `3 passed`: two `setup` tests (the one-time logins) and yours. Add `--headed` to watch the browser, or use `npm run test:ui` to step through it.

## 6. See it fail usefully

Change `'1'` to `'2'` and run again. Then open the report:

```bash
npm run report
```

The failed test shows the expected vs. received value, a screenshot, a video and a **trace** — a step-by-step recording you can scrub through. Change the value back to `'1'`.

## 7. Check before you commit

```bash
npm run verify
```

This runs the type checker, the linter, the formatter check and the docs link check. Your test is done when `verify` and the test both pass.

## What's next

- Learn the architecture behind what you just used: [Framework guide](framework-guide.md).
- Add a new page, API endpoint or persona: [How-to guides](how-to.md).
- Look up every fixture and tag: [Reference](reference.md).
- Delete `my-first.spec.ts` if it was only practice — `cart.spec.ts` already covers the cart.
