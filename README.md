# Playwright Test Framework

End-to-end UI and API test framework built on [Playwright](https://playwright.dev) and TypeScript. It tests two public demo applications:

| Target                                                 | What it is                                  | Tested by                         |
| ------------------------------------------------------ | ------------------------------------------- | --------------------------------- |
| [SauceDemo](https://www.saucedemo.com)                 | Web shop (login, inventory, cart, checkout) | `tests/e2e/` (Chromium + Firefox) |
| [Restful-Booker](https://restful-booker.herokuapp.com) | REST API for hotel bookings                 | `tests/api/`                      |

What you get out of the box:

- **No UI logins in tests** — each user persona logs in once per run; tests start already authenticated.
- **Page Object Model** with reusable components; page objects never assert, specs do.
- **Contract-checked API clients** — every response is validated against a Zod schema.
- **Automatic test-data cleanup** — anything a test creates is deleted afterwards, pass or fail.
- **One codebase, three environments** (`qa`, `staging`, `prod`) with validated configuration.
- **Reports**: Playwright HTML, JUnit XML and Allure, with traces, screenshots and video on failure.

## Quick start

Prerequisites: **Node.js 20+** and npm.

```bash
npm ci                      # 1. install dependencies
npm run install:browsers    # 2. download Chromium and Firefox
cp .env.example .env        # 3. create local config (demo credentials are pre-filled)
npm test                    # 4. run everything (~35 s)
npm run report              # 5. open the HTML report
```

All 58 tests should pass. If startup fails with `Invalid test configuration`, step 3 was skipped — the message names the missing variable.

## Everyday commands

| Command                                                             | Does                                                             |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run test:e2e` / `npm run test:api`                             | UI tests only / API tests only                                   |
| `npm run test:smoke`                                                | Fast smoke subset (`@smoke`)                                     |
| `npx playwright test tests/e2e/cart.spec.ts --project=e2e-chromium` | One file, one browser                                            |
| `npx playwright test --project=e2e-chromium --headed --workers=1`   | Watch the browser, one test at a time                            |
| `npm run test:ui`                                                   | Interactive UI mode (pick, watch, time-travel)                   |
| `npm run verify`                                                    | Typecheck + lint + formatting + docs links — run before every PR |

The full list is in the [reference](docs/reference.md#npm-scripts).

## Documentation

| If you want to…                                         | Read                                                |
| ------------------------------------------------------- | --------------------------------------------------- |
| Write your first test, step by step                     | [Getting started](docs/getting-started.md)          |
| Understand how the framework is put together            | [Framework guide](docs/framework-guide.md)          |
| Add a page, endpoint, persona, setting; debug a failure | [How-to guides](docs/how-to.md)                     |
| Look up fixtures, tags, environments, variables         | [Reference](docs/reference.md)                      |
| Know why something was designed this way                | [Architecture decision records](docs/adr/README.md) |
| Contribute a change                                     | [Contributing](CONTRIBUTING.md)                     |

## Project layout

```text
config/          per-environment settings (default, qa, staging, prod)
src/api/         API clients + Zod response schemas
src/config/      validated configuration loader (env.ts) and auth paths
src/fixtures/    Playwright fixtures — the `test` and `expect` every spec imports
src/pages/       page objects and reusable UI components
src/types/       shared TypeScript types
src/utils/       catalog data, test-data factory, cleanup registry, logger, tags
tests/e2e/       UI specs
tests/api/       API specs
tests/auth.setup.ts  logs each persona in once per run
docs/            documentation
```

Changes are listed in the [changelog](CHANGELOG.md).
