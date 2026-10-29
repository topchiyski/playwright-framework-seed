import { test as base, type APIRequestContext } from '@playwright/test';
import { storageStatePath } from '@config/auth';
import { env } from '@config/env';
import { DEFAULT_ROLE, type SessionRole } from '@app-types/config.types';
import { CleanupRegistry } from '@utils/cleanup-registry';

/**
 * Framework fixtures — independent of the application under test.
 * App-specific fixtures (page objects, API clients, sign-in steps) live in `app.fixtures.ts`.
 */

type BaseOptions = {
  /**
   * Which persona's saved session the browser context starts with (default: `DEFAULT_ROLE`
   * from `config/personas.ts`). `'anonymous'` starts logged out. Override with `test.use({ role })`.
   */
  role: SessionRole;
};

type BaseTestFixtures = {
  /** Register teardown callbacks; they run LIFO after the test regardless of outcome. */
  cleanup: CleanupRegistry;
};

type BaseWorkerFixtures = {
  /** One HTTP context per worker, pre-configured for the API base URL. */
  apiRequest: APIRequestContext;
};

export const test = base.extend<BaseOptions & BaseTestFixtures, BaseWorkerFixtures>({
  role: [DEFAULT_ROLE, { option: true }],

  storageState: async ({ role }, use) => {
    await use(role === 'anonymous' ? { cookies: [], origins: [] } : storageStatePath(role));
  },

  cleanup: async ({}, use) => {
    const registry = new CleanupRegistry();
    await use(registry);
    await registry.runAll();
  },

  apiRequest: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext({
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
        timeout: env.timeouts.navigation,
      });
      await use(context);
      await context.dispose();
    },
    { scope: 'worker' },
  ],
});
