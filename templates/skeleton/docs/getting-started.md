# Getting started: write your first test

This tutorial takes you from a fresh clone to a new passing UI test in about 10 minutes. You will learn the three things every spec in this project relies on: the shared `test` import, page objects, and web-first assertions.

## 1. Set up and run the suite

```bash
npm ci
npm run install:browsers
cp .env.example .env
npm test
```

Wait for the run to finish green. A green run proves your machine, browsers and configuration are ready before you change anything.

### If the first run fails

| Symptom                                                       | Likely cause and fix                                                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Invalid test configuration … is required`                    | `.env` is missing or incomplete — run `cp .env.example .env` and fill in the values.                                                               |
| `Executable doesn't exist` for a browser                      | Browsers not installed — run `npm run install:browsers`.                                                                                           |
| Many tests fail with `page.goto: Timeout` in one browser only | Something on your machine filters that browser's traffic (e.g. an ad blocker or proxy). Exclude Playwright's browsers from filtering, or pause it. |
| Many tests fail with timeouts in every browser                | The application under test is slow or unreachable from your machine. Check it in a normal browser.                                                 |

## 2. Look at an existing test

Open `tests/e2e/home.spec.ts`:

```ts
import { expect, TAG, test } from '@fixtures/index';

test('shows the main heading', { tag: [TAG.smoke] }, async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.heading).toHaveText('Your application under test');
});
```

- `test` and `expect` come from **`@fixtures/index`**, never from `@playwright/test`. The project's `test` knows how to sign in, clean up data and skip unsafe tests in production. Importing from `@playwright/test` is a lint error.
- `homePage` is a **fixture**: a ready-made page object (`src/pages/home.page.ts`). You ask for it by name; Playwright creates it.
- `goto()` opens the page and waits until it is ready — no sleeps.
- `expect(locator).toHaveText(...)` **retries until the condition holds**, which is why the framework never needs fixed waits.

## 3. Add your own test

Add a second test to the same file:

```ts
test('has the expected page title', { tag: [TAG.regression] }, async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.page).toHaveTitle('Sandbox');
});
```

Run just this file in one browser:

```bash
npx playwright test tests/e2e/home.spec.ts --project=e2e-chromium
```

Add `--headed` to watch, or use `npm run test:ui` to step through it.

## 4. See it fail usefully

Change `'Sandbox'` to `'Something else'`, run again, then open the report with `npm run report`. The failed test shows expected vs. received, a screenshot, a video and a **trace** you can scrub through step by step. Change it back.

## 5. Check before you commit

```bash
npm run verify
```

Type check, lint, formatting and docs links. Your test is done when `verify` and the test both pass.

## What's next

- Point the suite at your application: [Make it yours](make-it-yours.md).
- Learn the architecture: [Framework guide](framework-guide.md).
- Recipes for pages, endpoints, personas and debugging: [How-to guides](how-to.md).
