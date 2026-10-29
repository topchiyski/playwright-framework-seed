# Reference

Exact names, values and options of the framework. For explanations see the [framework guide](framework-guide.md); for procedures see the [how-to guides](how-to.md); for the application under test (URLs, personas, app fixtures) see [the application under test](app.md).

## npm scripts

| Script                    | Runs                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `init:project`            | Seed only: replaces the demo with a skeleton (`-- --name <pkg> [--yes]`) |
| `test`                    | All projects: `setup`, `e2e-chromium`, `e2e-firefox`, `api`              |
| `test:e2e`                | UI specs in Chromium and Firefox (plus `setup`)                          |
| `test:api`                | API specs only                                                           |
| `test:smoke`              | Tests tagged `@smoke`, all projects                                      |
| `test:qa`                 | Everything with `TEST_ENV=qa`                                            |
| `test:staging`            | Everything with `TEST_ENV=staging`                                       |
| `test:prod`               | `TEST_ENV=prod`, `@smoke` only, `@destructive` excluded                  |
| `test:headed`             | UI specs in Chromium with a visible browser                              |
| `test:debug`              | Chromium UI specs under the Playwright Inspector (append `-- <spec>`)    |
| `test:ui`                 | Playwright UI mode                                                       |
| `report`                  | Serves the HTML report from `reports/html`                               |
| `allure:generate`         | Builds the Allure report into `reports/allure` (replaces the old one)    |
| `allure:open`             | Serves the generated Allure report                                       |
| `typecheck`               | `tsc --noEmit`                                                           |
| `lint` / `lint:fix`       | ESLint / ESLint with auto-fix                                            |
| `format` / `format:check` | Prettier write / check                                                   |
| `docs:check`              | Verifies relative links and anchors in all Markdown files                |
| `verify`                  | `typecheck` + `lint` + `format:check` + `docs:check`                     |
| `install:browsers`        | Downloads Chromium and Firefox (with OS dependencies on Linux)           |

Pass extra Playwright flags after `--`, e.g. `npm run test:e2e -- --headed`.

## Configuration precedence

Highest priority first. The first source that defines a value wins.

1. Real environment variables (shell or CI)
2. `.env.<TEST_ENV>` (e.g. `.env.staging`)
3. `.env`
4. `config/<TEST_ENV>.ts`
5. `config/default.ts`

Empty values count as unset at every level, so a blank CI secret falls through to the next source. The merged result is validated by `EnvSchema` in `src/config/env.ts` and exported as the read-only `env` object. `.env` files are git-ignored; `.env.example` is the template.

## Environment variables

| Variable       | Required | Values                                                  | Overrides           |
| -------------- | -------- | ------------------------------------------------------- | ------------------- |
| `TEST_ENV`     | no       | `qa` (default), `staging`, `prod`                       | selects the profile |
| `UI_PASSWORD`  | **yes**  | password of the UI test users                           | —                   |
| `API_USERNAME` | **yes**  | API user                                                | —                   |
| `API_PASSWORD` | **yes**  | API password                                            | —                   |
| `BASE_URL`     | no       | URL                                                     | `baseUrl`           |
| `API_BASE_URL` | no       | URL                                                     | `apiBaseUrl`        |
| `WORKERS`      | no       | positive integer                                        | `workers`           |
| `RETRIES`      | no       | `0`–`3`                                                 | `retries`           |
| `HEADLESS`     | no       | `true` / `false` (also `1`/`0`, `yes`/`no`, `on`/`off`) | `headless`          |
| `LOG_LEVEL`    | no       | `debug`, `info`, `warn`, `error`                        | `logLevel`          |
| `CI`           | no       | any non-empty value enables CI mode                     | see below           |

The three secrets are the demo's; a project renames them to match its own authentication (see [Make it yours](make-it-yours.md#5-configure-secrets)).

**CI mode** (`CI` set): `test.only` fails the run, workers are capped at 2, the run stops after 25 failures, the console uses the compact `dot` reporter, and an already-running `webServer` is not reused.

## Profile settings

Every field of `EnvironmentProfile` (`src/types/config.types.ts`). `config/default.ts` sets all of them; `config/<env>.ts` overrides some.

| Setting               | Meaning                                                                | `qa`  | `staging` | `prod`    |
| --------------------- | ---------------------------------------------------------------------- | ----- | --------- | --------- |
| `baseUrl`             | Web app URL (`page.goto('/…')` is relative to it)                      | —     | —         | —         |
| `apiBaseUrl`          | API URL used by `apiRequest`                                           | —     | —         | —         |
| `users`               | Username per persona in `USER_ROLES`                                   | —     | —         | —         |
| `testIdAttribute`     | Attribute `getByTestId()` matches                                      | —     | —         | —         |
| `webServer`           | Optional `{ command, url }` Playwright runs and waits for before tests | —     | —         | —         |
| `workers`             | Parallel workers (default 4)                                           | 4     | 4         | 2         |
| `retries`             | Retries per failed test (default 0)                                    | 0     | 1         | 1         |
| `timeouts.test`       | Per-test timeout (default 60 s)                                        | 60 s  | 60 s      | 60 s      |
| `timeouts.expect`     | Web-first assertion timeout (default 10 s)                             | 10 s  | 15 s      | 10 s      |
| `timeouts.action`     | Single action timeout (default 15 s)                                   | 15 s  | 15 s      | 15 s      |
| `timeouts.navigation` | Navigation timeout (default 30 s)                                      | 30 s  | 45 s      | 30 s      |
| `headless`            | Run browsers without a window (default true)                           | true  | true      | true      |
| `allowDestructive`    | Run `@destructive` tests (default true)                                | true  | true      | **false** |
| `logLevel`            | Framework log level (default `info`)                                   | debug | info      | warn      |

"—" means the environment uses `default.ts`. The application's values are listed in [the application under test](app.md#targets).

## Personas

Declared in `config/personas.ts`:

| Export         | Meaning                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| `USER_ROLES`   | Every persona the tests know; each needs a username in `users`                      |
| `AUTH_ROLES`   | Personas that can sign in; `tests/auth.setup.ts` saves `.auth/<role>.json` for each |
| `DEFAULT_ROLE` | The `role` a test starts with unless it calls `test.use({ role })`                  |

`'anonymous'` is always available as a `role`: a logged-out context. The demo's personas are listed in [the application under test](app.md#personas).

## Fixtures

Import `test` from `@fixtures/index`. Framework fixtures, available in every project:

| Fixture            | Scope  | Type / signature          | Notes                                                                                   |
| ------------------ | ------ | ------------------------- | --------------------------------------------------------------------------------------- |
| `role`             | test   | `AuthRole \| 'anonymous'` | Option; default `DEFAULT_ROLE`; set with `test.use()`                                   |
| `storageState`     | test   | session file path         | Derived from `role`; do not set directly                                                |
| `cleanup`          | test   | `CleanupRegistry`         | `register(label, fn)`; runs LIFO after the test, pass or fail                           |
| `apiRequest`       | worker | `APIRequestContext`       | Base URL = `apiBaseUrl`, `Accept: application/json`                                     |
| `environmentGuard` | test   | automatic                 | Skips `@destructive` when `allowDestructive` is false; adds an `environment` annotation |

Every `app.fixtures.ts` must also provide:

| Fixture        | Signature                                                    | Used by                                                 |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| `authenticate` | `(credentials: { username, password }) => Promise<BasePage>` | `tests/auth.setup.ts`, once per persona in `AUTH_ROLES` |

The demo's application fixtures (page objects, clients, `seedCart`, `createBooking`) are listed in [the application under test](app.md#app-specific-fixtures-and-data).

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

Shared settings: `fullyParallel: true`; `testIdAttribute` and `webServer` come from the profile.

## Reports and artifacts

| Output                      | Location                               | Kept                             |
| --------------------------- | -------------------------------------- | -------------------------------- |
| HTML report                 | `reports/html/`                        | always (overwritten per run)     |
| JUnit XML                   | `reports/junit/results.xml`            | always                           |
| Allure raw results          | `allure-results/`                      | cleared at the start of each run |
| Allure report               | `reports/allure/`                      | after `npm run allure:generate`  |
| Trace, screenshot, video    | `test-results/<test>/`                 | failed tests only                |
| Page accessibility snapshot | `test-results/<test>/error-context.md` | failed tests only                |

Allure reports must stay private for now — see [reporting and artifacts](framework-guide.md#reporting-and-artifacts).

## Continuous integration

| File                              | Runs on                       | Does                                                                                                                                 |
| --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/ci.yml`        | push to `main`, pull requests | `verify` on Node 22 and 26; then `npm test` in both browsers; uploads `reports/`, `allure-results/` and, on failure, `test-results/` |
| `.github/workflows/seed-init.yml` | push to `main`, pull requests | Seed only: runs `init:project`, then `verify` and `npm test` on the skeleton                                                         |
| `.github/dependabot.yml`          | weekly                        | Grouped npm and GitHub Actions update pull requests; TypeScript held below 6.1 for `typescript-eslint`                               |

CI copies `.env.example` to `.env`, then reads repository secrets named like the variables above; unset secrets fall back to `.env.example`.

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
