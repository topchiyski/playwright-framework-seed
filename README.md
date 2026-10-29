# Playwright Framework Seed

[![CI](https://github.com/topchiyski/playwright-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/topchiyski/playwright-framework/actions/workflows/ci.yml)
[![Seed init](https://github.com/topchiyski/playwright-framework/actions/workflows/seed-init.yml/badge.svg)](https://github.com/topchiyski/playwright-framework/actions/workflows/seed-init.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A ready-to-use starting point for end-to-end UI and API test suites with [Playwright](https://playwright.dev) and TypeScript. Start your own project with one command, or explore the complete demo suite first.

What every project started from this seed gets:

- **No UI logins in tests** — each user persona signs in once per run; tests start already authenticated.
- **Page Object Model** with reusable components; page objects never assert, specs do.
- **Contract-checked API clients** — every response is validated against a Zod schema.
- **Automatic test-data cleanup** — anything a test creates is deleted afterwards, pass or fail.
- **One codebase, three environments** (`qa`, `staging`, `prod`) with validated configuration.
- **Reports**: Playwright HTML, JUnit XML and Allure, with traces, screenshots and video on failure.
- **Guard rails**: lint rules for flaky patterns, one `verify` command, CI and Dependabot ready to go.

Prerequisites: **Node.js 22+** (an [active or maintenance LTS](https://nodejs.org/en/about/previous-releases)) and npm.

## Start your own project

```bash
git clone https://github.com/topchiyski/playwright-framework.git my-app-e2e   # or "Use this template" on GitHub
cd my-app-e2e
npm ci && npm run install:browsers
npm run init:project -- --name my-app-e2e --yes   # replace the demo with a working skeleton
npm test                                          # green from the start
```

Then follow [Make it yours](docs/make-it-yours.md) to point the suite at your application.

## Explore the demo

The seed ships with a complete demo suite (58 tests) against two public applications — the [SauceDemo](https://www.saucedemo.com) web shop and the [Restful-Booker](https://restful-booker.herokuapp.com) API ([details](docs/app.md)). It is the reference implementation of every pattern in the framework.

```bash
npm ci                      # 1. install dependencies
npm run install:browsers    # 2. download Chromium and Firefox
cp .env.example .env        # 3. create local config (demo credentials are pre-filled)
npm test                    # 4. run everything (~35 s)
npm run report              # 5. open the HTML report
```

If something fails on the first run, see [if the first run fails](docs/getting-started.md#if-the-first-run-fails).

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
| Start a project for your own application                | [Make it yours](docs/make-it-yours.md)              |
| Write your first test, step by step                     | [Getting started](docs/getting-started.md)          |
| Understand how the framework is put together            | [Framework guide](docs/framework-guide.md)          |
| Add a page, endpoint, persona, setting; debug a failure | [How-to guides](docs/how-to.md)                     |
| Look up fixtures, tags, settings, variables, CI         | [Reference](docs/reference.md)                      |
| Know the application under test (demo)                  | [The application under test](docs/app.md)           |
| Know why something was designed this way                | [Architecture decision records](docs/adr/README.md) |
| Contribute a change                                     | [Contributing](CONTRIBUTING.md)                     |

## Project layout

```text
config/              application settings: URLs, personas, per-environment profiles
src/api/             API clients + Zod response schemas
src/config/          validated configuration loader (env.ts) and auth paths
src/fixtures/        base (framework) → app (your application) → index: the `test` every spec imports
src/pages/           page objects and reusable UI components
src/types/           shared TypeScript types
src/utils/           test-data helpers, cleanup registry, logger, tags (+ demo catalog and builders)
tests/e2e/           UI specs
tests/api/           API specs
tests/auth.setup.ts  signs each persona in once per run
templates/skeleton/  what init:project installs in place of the demo
docs/                documentation
```

Which files are framework and which belong to the application is listed in the [framework guide](docs/framework-guide.md#framework-and-application-code). Changes are listed in the [changelog](CHANGELOG.md).

## License

[MIT](LICENSE) © 2026 Stoyan Topchiyski
