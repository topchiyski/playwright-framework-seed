# TODO: project name

End-to-end UI and API tests for **TODO: your application**, built on the [Playwright framework seed](https://github.com/topchiyski/playwright-framework).

Prerequisites: **Node.js 22+** and npm.

## Quick start

```bash
npm ci                      # install dependencies
npm run install:browsers    # download Chromium and Firefox
cp .env.example .env        # local configuration; fill in the secrets
npm test                    # run everything
npm run report              # open the HTML report
```

## Everyday commands

| Command                                                  | Does                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run test:e2e` / `npm run test:api`                  | UI tests only / API tests only                                   |
| `npm run test:smoke`                                     | Fast smoke subset (`@smoke`)                                     |
| `npx playwright test <spec path> --project=e2e-chromium` | One file, one browser                                            |
| `npm run test:ui`                                        | Interactive UI mode                                              |
| `npm run verify`                                         | Typecheck + lint + formatting + docs links — run before every PR |

## Documentation

| If you want to…                                         | Read                                       |
| ------------------------------------------------------- | ------------------------------------------ |
| Finish setting up this project                          | [Make it yours](docs/make-it-yours.md)     |
| Write your first test, step by step                     | [Getting started](docs/getting-started.md) |
| Know the application under test                         | [The application under test](docs/app.md)  |
| Understand how the framework is put together            | [Framework guide](docs/framework-guide.md) |
| Add a page, endpoint, persona, setting; debug a failure | [How-to guides](docs/how-to.md)            |
| Look up fixtures, tags, settings, variables, CI         | [Reference](docs/reference.md)             |
| Contribute a change                                     | [Contributing](CONTRIBUTING.md)            |
