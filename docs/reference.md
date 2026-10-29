# Reference

Exact names, values and options. For explanations see the [framework guide](framework-guide.md); for procedures see the [how-to guides](how-to.md).

## npm scripts

| Script                    | Runs                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| `test`                    | All projects: `setup`, `e2e-chromium`, `e2e-firefox`, `api`           |
| `test:e2e`                | UI specs in Chromium and Firefox (plus `setup`)                       |
| `test:api`                | API specs only                                                        |
| `test:smoke`              | Tests tagged `@smoke`, all projects                                   |
| `test:qa`                 | Everything with `TEST_ENV=qa`                                         |
| `test:staging`            | Everything with `TEST_ENV=staging`                                    |
| `test:prod`               | `TEST_ENV=prod`, `@smoke` only, `@destructive` excluded               |
| `test:headed`             | UI specs in Chromium with a visible browser                           |
| `test:debug`              | Chromium UI specs under the Playwright Inspector (append `-- <spec>`) |
| `test:ui`                 | Playwright UI mode                                                    |
| `report`                  | Serves the HTML report from `reports/html`                            |
| `allure:generate`         | Builds the Allure report into `reports/allure` (replaces the old one) |
| `allure:open`             | Serves the generated Allure report                                    |
| `typecheck`               | `tsc --noEmit`                                                        |
| `lint` / `lint:fix`       | ESLint / ESLint with auto-fix                                         |
| `format` / `format:check` | Prettier write / check                                                |
| `docs:check`              | Verifies relative links and anchors in all Markdown files             |
| `verify`                  | `typecheck` + `lint` + `format:check` + `docs:check`                  |
| `install:browsers`        | Downloads Chromium and Firefox (with OS dependencies on Linux)        |

Pass extra Playwright flags after `--`, e.g. `npm run test:e2e -- --headed`.

## Configuration precedence

Highest priority first. The first source that defines a value wins.

1. Real environment variables (shell or CI)
2. `.env.<TEST_ENV>` (e.g. `.env.staging`)
3. `.env`
4. `config/<TEST_ENV>.ts`
5. `config/default.ts`

The merged result is validated by `EnvSchema` in `src/config/env.ts` and exported as the read-only `env` object. `.env` files are git-ignored; `.env.example` is the template.

## Environment variables

| Variable       | Required | Values                                                  | Overrides           |
| -------------- | -------- | ------------------------------------------------------- | ------------------- |
| `TEST_ENV`     | no       | `qa` (default), `staging`, `prod`                       | selects the profile |
| `UI_PASSWORD`  | **yes**  | SauceDemo password                                      | —                   |
| `API_USERNAME` | **yes**  | Restful-Booker admin user                               | —                   |
| `API_PASSWORD` | **yes**  | Restful-Booker admin password                           | —                   |
| `BASE_URL`     | no       | URL                                                     | `baseUrl`           |
| `API_BASE_URL` | no       | URL                                                     | `apiBaseUrl`        |
| `WORKERS`      | no       | positive integer                                        | `workers`           |
| `RETRIES`      | no       | `0`–`3`                                                 | `retries`           |
| `HEADLESS`     | no       | `true` / `false` (also `1`/`0`, `yes`/`no`, `on`/`off`) | `headless`          |
| `LOG_LEVEL`    | no       | `debug`, `info`, `warn`, `error`                        | `logLevel`          |
| `CI`           | no       | any non-empty value enables CI mode                     | see below           |

**CI mode** (`CI` set): `test.only` fails the run, workers are capped at 2, the run stops after 25 failures, and the console uses the compact `dot` reporter.

## Environments

| Setting               | `default.ts` | `qa`  | `staging` | `prod`    |
| --------------------- | ------------ | ----- | --------- | --------- |
| `workers`             | 4            | 4     | 4         | 2         |
| `retries`             | 0            | 0     | 1         | 1         |
| `timeouts.test`       | 60 s         | 60 s  | 60 s      | 60 s      |
| `timeouts.expect`     | 10 s         | 10 s  | 15 s      | 10 s      |
| `timeouts.action`     | 15 s         | 15 s  | 15 s      | 15 s      |
| `timeouts.navigation` | 30 s         | 30 s  | 45 s      | 30 s      |
| `allowDestructive`    | true         | true  | true      | **false** |
| `logLevel`            | info         | debug | info      | warn      |

All environments currently target `https://www.saucedemo.com` and `https://restful-booker.herokuapp.com`.

## Personas

| `role`              | SauceDemo user            | Pre-authenticated | Notes                                  |
| ------------------- | ------------------------- | ----------------- | -------------------------------------- |
| `standard`          | `standard_user`           | yes (default)     | Normal behaviour                       |
| `performanceGlitch` | `performance_glitch_user` | yes               | Deliberately slow responses            |
| `lockedOut`         | `locked_out_user`         | no                | Login is rejected; used in login tests |
| `anonymous`         | —                         | —                 | Fixture value for a logged-out context |

Session files are written to `.auth/<role>.json` by `tests/auth.setup.ts`.

## Fixtures

Import from `@fixtures/index`.

| Fixture                   | Scope  | Type / signature                                | Notes                                                                                   |
| ------------------------- | ------ | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `role`                    | test   | `AuthRole \| 'anonymous'`                       | Option; default `'standard'`; set with `test.use()`                                     |
| `storageState`            | test   | session file path                               | Derived from `role`; do not set directly                                                |
| `loginPage`               | test   | `LoginPage`                                     |                                                                                         |
| `inventoryPage`           | test   | `InventoryPage`                                 |                                                                                         |
| `cartPage`                | test   | `CartPage`                                      |                                                                                         |
| `checkoutInformationPage` | test   | `CheckoutInformationPage`                       | Checkout step 1                                                                         |
| `checkoutOverviewPage`    | test   | `CheckoutOverviewPage`                          | Checkout step 2                                                                         |
| `checkoutCompletePage`    | test   | `CheckoutCompletePage`                          | Confirmation                                                                            |
| `seedCart`                | test   | `(...products: Product[]) => Promise<CartPage>` | Writes cart storage, opens the cart page                                                |
| `apiRequest`              | worker | `APIRequestContext`                             | Base URL = `apiBaseUrl`, `Accept: application/json`                                     |
| `apiToken`                | worker | `string`                                        | Admin token, fetched once per worker                                                    |
| `authApi`                 | test   | `AuthApi`                                       |                                                                                         |
| `bookingApi`              | test   | `BookingApi`                                    | Authenticated with `apiToken`                                                           |
| `cleanup`                 | test   | `CleanupRegistry`                               | `register(label, fn)`; runs LIFO after the test                                         |
| `createBooking`           | test   | `(overrides?) => Promise<CreatedBooking>`       | Creates via API, deletion auto-registered                                               |
| `environmentGuard`        | test   | automatic                                       | Skips `@destructive` when `allowDestructive` is false; adds an `environment` annotation |

## Custom matchers

| Matcher                                  | Use on                      | Passes when                                                     |
| ---------------------------------------- | --------------------------- | --------------------------------------------------------------- |
| `await expect(response).toHaveStatus(n)` | `APIResponse`               | status equals `n`; failure message includes the body            |
| `expect(value).toMatchSchema(schema)`    | parsed JSON typed `unknown` | `schema.safeParse(value)` succeeds; failure lists each mismatch |

## Tags

Use the constants from `TAG` (exported by `@fixtures/index`), not string literals.

| Constant          | Tag            | Meaning                                                 |
| ----------------- | -------------- | ------------------------------------------------------- |
| `TAG.smoke`       | `@smoke`       | Critical path; runs on every deployment, including prod |
| `TAG.regression`  | `@regression`  | Full behavioural coverage                               |
| `TAG.contract`    | `@contract`    | Validates an API response schema                        |
| `TAG.destructive` | `@destructive` | Creates, changes or deletes data; never runs in prod    |

## Playwright projects

| Project        | Test files            | Depends on | Browser         |
| -------------- | --------------------- | ---------- | --------------- |
| `setup`        | `tests/auth.setup.ts` | —          | Desktop Chrome  |
| `e2e-chromium` | `tests/e2e/**`        | `setup`    | Desktop Chrome  |
| `e2e-firefox`  | `tests/e2e/**`        | `setup`    | Desktop Firefox |
| `api`          | `tests/api/**`        | —          | none            |

Shared settings: `testIdAttribute: 'data-test'`, `fullyParallel: true`.

## Reports and artifacts

| Output                      | Location                               | Kept                             |
| --------------------------- | -------------------------------------- | -------------------------------- |
| HTML report                 | `reports/html/`                        | always (overwritten per run)     |
| JUnit XML                   | `reports/junit/results.xml`            | always                           |
| Allure raw results          | `allure-results/`                      | cleared at the start of each run |
| Allure report               | `reports/allure/`                      | after `npm run allure:generate`  |
| Trace, screenshot, video    | `test-results/<test>/`                 | failed tests only                |
| Page accessibility snapshot | `test-results/<test>/error-context.md` | failed tests only                |

## Lint rules that enforce the conventions

| Rule                                                                                                      | Applies to               | Prevents                                   |
| --------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------ |
| `no-restricted-syntax` (`waitForTimeout`)                                                                 | all TypeScript           | fixed sleeps                               |
| `playwright/no-wait-for-timeout`, `no-force-option`, `no-networkidle`, `no-page-pause`, `no-focused-test` | `tests/`                 | flaky or leftover debugging code           |
| `playwright/prefer-web-first-assertions`                                                                  | `tests/`                 | non-retrying assertions                    |
| `no-restricted-imports` (`expect`, `test`)                                                                | `src/pages/`, `src/api/` | assertions inside page objects and clients |
| `no-restricted-imports` (`@playwright/test`)                                                              | `tests/`                 | bypassing the project fixtures             |
| `@typescript-eslint/no-floating-promises`                                                                 | all TypeScript           | forgotten `await`                          |
| `@typescript-eslint/consistent-type-imports`                                                              | all TypeScript           | value imports used only as types           |

## Import aliases

| Alias           | Points to        |
| --------------- | ---------------- |
| `@api/*`        | `src/api/*`      |
| `@config/*`     | `src/config/*`   |
| `@fixtures/*`   | `src/fixtures/*` |
| `@pages/*`      | `src/pages/*`    |
| `@utils/*`      | `src/utils/*`    |
| `@app-types/*`  | `src/types/*`    |
| `@env-config/*` | `config/*`       |
