# Make it yours: start a project from this seed

This guide turns the seed into the test suite for **your** application. Allow about an hour to reach a first real test; steps 1–3 take five minutes. If `init:project` has already run in your repository, continue at [step 4](#4-point-it-at-your-application).

## 1. Create your repository

**From GitHub:** on the seed repository click **Use this template → Create a new repository**, then clone your new repository.

**Without the template button:** clone the seed and point it at your own empty repository:

```bash
git clone https://github.com/topchiyski/playwright-framework.git my-app-e2e
cd my-app-e2e
git remote set-url origin https://github.com/<you>/my-app-e2e.git
```

## 2. Try the demo first (optional, recommended)

```bash
npm ci
npm run install:browsers
cp .env.example .env
npm test
```

Seeing the demo pass — and reading one spec such as `tests/e2e/cart.spec.ts` — is the fastest way to learn the patterns you are about to use.

## 3. Initialise

```bash
npm run init:project -- --name my-app-e2e          # dry run: lists every change
npm run init:project -- --name my-app-e2e --yes    # apply
npm test                                           # 3 passed
```

`init:project` removes the demo application code and installs a **skeleton**: a home-page object, a health-check API client, one UI and one API smoke test, placeholder configuration, and a tiny local **sandbox app** that Playwright starts automatically, so the suite is green before you change anything. It also resets the package name, version and changelog, creates `.env` if missing, and finally deletes itself. Framework code is not touched.

Commit now, so every later change is easy to review:

```bash
git add -A && git commit -m "chore: initialise from Playwright seed"
```

## 4. Point it at your application

In `config/default.ts`:

- Set `baseUrl` (web app) and `apiBaseUrl` (API).
- Set `testIdAttribute` to the attribute your app uses for test IDs (Playwright's default is `data-testid`).
- Remove `webServer` and delete the `sandbox/` folder — unless you want Playwright to start your app locally, in which case set `webServer.command` to your start command and `webServer.url` to a URL that answers once it is up.

Then put per-environment differences (URLs, timeouts, retries) in `config/qa.ts`, `config/staging.ts` and `config/prod.ts`. `prod` disallows `@destructive` tests; keep it that way.

## 5. Configure secrets

Edit `.env.example` and the `credentials` block in `src/config/env.ts` to match how your application authenticates (rename or remove `UI_PASSWORD`, `API_USERNAME`, `API_PASSWORD`). Put real values in your local `.env` only. See [add a configuration setting](how-to.md#add-a-configuration-setting).

## 6. Sign in once per persona

1. Create a page object for your login page ([how to add a page object](how-to.md#add-a-page-object)) and one for the page users land on afterwards.
2. Implement `authenticate` in `src/fixtures/app.fixtures.ts`: open the login page, sign in, and return the landing page's `waitUntilReady()`.
3. In `config/personas.ts`, list your personas in `USER_ROLES`, add the ones that can sign in to `AUTH_ROLES`, and set `DEFAULT_ROLE` (usually your main persona instead of `'anonymous'`).
4. Put each persona's username in `users` in `config/default.ts`.
5. Run `npx playwright test --project=setup` — it should save `.auth/<persona>.json` for each persona.

From now on every UI test starts signed in; see [how authentication works](framework-guide.md#authentication-log-in-once-per-persona).

## 7. Write your tests

- Replace the examples (`HomePage`, `HealthApi`, `home.spec.ts`, `health.spec.ts`) with your own page objects, API clients and specs — the [how-to guides](how-to.md) have a recipe for each.
- Put app-specific fixtures (page objects, clients, data seeding) in `src/fixtures/app.fixtures.ts`, complete test-data builders in `src/utils/builders.ts`, and fixed expected values in a module such as `src/utils/catalog.ts`.
- The demo you removed remains the reference implementation: browse it in the seed repository whenever you want a worked example.

## 8. Describe your application

- Fill in [docs/app.md](app.md): targets, personas, app-specific fixtures, known quirks.
- Fill in `.claude/rules/app.md` with the same facts in short form, if your team uses Claude Code.
- Rewrite `README.md` for your project.

## 9. Turn on CI

The workflow in `.github/workflows/ci.yml` runs `verify` and the full suite on every push and pull request and uploads reports. Add your secrets under **Settings → Secrets and variables → Actions** using the same names as `.env.example`; CI copies `.env.example` to `.env` first, so any secret you do not set falls back to its value there. Dependabot (`.github/dependabot.yml`) opens weekly update pull requests automatically.

## 10. Stay up to date with the seed

Framework improvements arrive as new seed versions; see the [seed changelog](https://github.com/topchiyski/playwright-framework/blob/main/CHANGELOG.md). Which files belong to the framework is listed in [framework and application code](framework-guide.md#framework-and-application-code). To review what changed since the version you started from:

```bash
git remote add seed https://github.com/topchiyski/playwright-framework.git
git fetch seed --tags
git diff v1.1.0 seed/main -- src/config src/fixtures/base.fixtures.ts src/fixtures/index.ts src/fixtures/matchers.ts src/utils playwright.config.ts
```

Apply the parts you want by hand or with `git checkout seed/main -- <file>` for files you have not changed.
