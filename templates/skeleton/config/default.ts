import type { EnvironmentProfile } from '../src/types/config.types';

/**
 * Baseline profile for the application under test. Environment files in this folder override
 * only what differs. Do NOT put secrets here — see `.env.example`.
 *
 * TODO: point baseUrl/apiBaseUrl at your application. Remove `webServer` (and the sandbox/
 * folder) unless Playwright should start your app locally before the tests.
 */
export const defaultProfile: EnvironmentProfile = {
  baseUrl: 'http://localhost:4173',
  apiBaseUrl: 'http://localhost:4173',
  users: {
    user: 'replace-me@example.com',
  },
  testIdAttribute: 'data-testid',
  webServer: {
    command: 'node sandbox/server.mjs',
    url: 'http://localhost:4173/api/health',
  },
  timeouts: {
    test: 60_000,
    expect: 10_000,
    action: 15_000,
    navigation: 30_000,
  },
  workers: 4,
  retries: 0,
  headless: true,
  allowDestructive: true,
  logLevel: 'info',
};
