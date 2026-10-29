import fs from 'node:fs';
import { AUTH_DIR, credentialsFor, storageStatePath } from '@config/auth';
import { AUTH_ROLES } from '@app-types/config.types';
import { expect, test as setup } from '@fixtures/index';

/**
 * Runs once per test run (project `setup`). Signs every persona in `AUTH_ROLES` in a single
 * time and saves the session, so no spec ever logs in through the UI. The sign-in steps
 * themselves are app-specific and come from the `authenticate` fixture (`app.fixtures.ts`).
 */
setup.use({ role: 'anonymous' });

setup.beforeAll(() => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
});

for (const role of AUTH_ROLES) {
  setup(`authenticate as ${role}`, async ({ page, authenticate }) => {
    const landingPage = await authenticate(credentialsFor(role));

    await expect(landingPage.readyLocator).toBeVisible();

    await page.context().storageState({ path: storageStatePath(role) });
  });
}
