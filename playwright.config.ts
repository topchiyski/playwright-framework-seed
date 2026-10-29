import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

const ALLURE_RESULTS_DIR = 'allure-results';

// allure-playwright appends to its results dir, so each run would otherwise report every past run too.
// Workers re-load this file (and have TEST_WORKER_INDEX set) — only the main process may clean.
if (!process.env.TEST_WORKER_INDEX) {
  fs.rmSync(ALLURE_RESULTS_DIR, { recursive: true, force: true });
}

/**
 * Projects:
 *  - setup          logs in once per persona and saves storage state to .auth/ (tests/auth.setup.ts)
 *  - e2e-chromium   UI specs; depend on setup and start already authenticated (see `role` fixture)
 *  - e2e-firefox    same specs, cross-browser
 *  - api            API specs; no browser, no setup dependency
 *
 * All environment-specific values come from the Zod-validated `env` (src/config/env.ts).
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: env.timeouts.test,
  expect: { timeout: env.timeouts.expect },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.retries,
  workers: env.isCI ? Math.min(env.workers, 2) : env.workers,
  // Fail fast in CI if something is fundamentally broken (e.g. env down).
  maxFailures: env.isCI ? 25 : undefined,

  reporter: [
    [env.isCI ? 'dot' : 'list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: ALLURE_RESULTS_DIR,
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          environment: env.name,
          baseUrl: env.baseUrl,
          apiBaseUrl: env.apiBaseUrl,
          node: process.version,
        },
      },
    ],
  ],

  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    testIdAttribute: 'data-test',
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiBaseUrl },
    },
  ],
});
