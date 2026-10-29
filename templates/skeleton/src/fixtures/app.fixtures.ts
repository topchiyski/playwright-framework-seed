import { HealthApi } from '@api/health.api';
import { HomePage, type BasePage } from '@pages/index';
import { test as base } from './base.fixtures';

/**
 * Application-specific fixtures: your page objects, API clients, data seeding and sign-in steps.
 * Built on the framework fixtures in `base.fixtures.ts` (`role`, `cleanup`, `apiRequest`).
 */
type AppFixtures = {
  /**
   * Signs in through the UI and resolves with the page the user lands on once it is ready.
   * Used only by `tests/auth.setup.ts` to save each persona's session.
   */
  authenticate: (credentials: { username: string; password: string }) => Promise<BasePage>;

  homePage: HomePage;
  healthApi: HealthApi;
};

export const test = base.extend<AppFixtures>({
  authenticate: async ({}, use) => {
    await use(async () => {
      // TODO: e.g. `await loginPage.goto(); await loginPage.login(username, password); return dashboardPage.waitUntilReady();`
      throw new Error(
        'Implement `authenticate` in src/fixtures/app.fixtures.ts before adding personas to ' +
          'AUTH_ROLES in config/personas.ts. See docs/make-it-yours.md.',
      );
    });
  },

  homePage: async ({ page }, use) => use(new HomePage(page)),

  healthApi: async ({ apiRequest }, use) => use(new HealthApi(apiRequest)),
});
