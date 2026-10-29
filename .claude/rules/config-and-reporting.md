---
paths:
  - 'config/**/*.ts'
  - 'src/config/**/*.ts'
  - 'src/types/config.types.ts'
  - 'playwright.config.ts'
  - 'tests/auth.setup.ts'
  - 'package.json'
---

# Configuration, auth setup & reporting

- Precedence is defined in `loadEnv()` (`src/config/env.ts`) and documented in `docs/reference.md#configuration-precedence`; change both together. Result is the frozen, Zod-validated `env`.
- New setting: add to `EnvironmentProfile` (`src/types/config.types.ts`) → default in `config/default.ts` → field in `EnvSchema` (`env.ts`) → optional env-var override in `loadEnv()`. Per-env differences go in `config/<env>.ts` as `DeepPartial`.
- Secrets (`UI_PASSWORD`, `API_USERNAME`, `API_PASSWORD`) come only from env vars / `.env`; keep profiles secret-free and document new vars in `.env.example`. Empty values count as unset (`nonEmpty()` in env.ts) so blank CI secrets fall through.
- `config/default.ts` and `config/personas.ts` are app-owned; `config/{qa,staging,prod}.ts`, `src/config/` and `playwright.config.ts` are framework — keep app names out of them.
- New persona: add to `USER_ROLES` (and `AUTH_ROLES` if it can sign in) in `config/personas.ts`, plus `users` in `config/default.ts`; `tests/auth.setup.ts` then saves `.auth/<role>.json` via the app's `authenticate` fixture. `DEFAULT_ROLE` sets the starting session.
- Projects: `setup` → `e2e-chromium`/`e2e-firefox` (depend on setup); `api` is independent and uses `apiBaseUrl`. `testIdAttribute` and optional `webServer` come from the profile.
- `scripts/init-project.mjs` + `templates/skeleton/` (seed only): a new demo file needs the `// Demo app` marker and a `DEMO_PATHS` entry; skeleton changes are tested by `.github/workflows/seed-init.yml`.
- Code at the top level of `playwright.config.ts` runs in the main process and again in every worker; guard main-only side effects with `if (!process.env.TEST_WORKER_INDEX)`.

<!-- 2026-10-29: Triggered by allure-results accumulating 466 files over ~9 runs (allure-playwright appends). Outcome: main-process rmSync gives 11 files per api run, stable across reruns. Prune when: allure-playwright gains a clean-results option. -->

- `allure:generate` must delete `reports/allure` before generating.

<!-- 2026-10-29: Triggered by Allure 3 EPERM renaming reports/allure/awesome/data on Windows when the output dir exists. Outcome: pre-delete makes back-to-back generates exit 0. Prune when: Allure fixes in-place regeneration on Windows. -->
