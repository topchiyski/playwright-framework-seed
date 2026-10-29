import fs from 'node:fs';
import { AUTH_DIR, credentialsFor, storageStatePath } from '@config/auth';
import { AUTH_ROLES } from '@app-types/config.types';
import { expect, test as setup } from '@fixtures/index';

/**
 * Runs once per test run (project `setup`). Logs every persona in through the UI a single
 * time and persists the session, so no spec ever logs in through the UI.
 */
setup.use({ role: 'anonymous' });

setup.beforeAll(() => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
});

for (const role of AUTH_ROLES) {
  setup(`authenticate as ${role}`, async ({ page, loginPage, inventoryPage }) => {
    const { username, password } = credentialsFor(role);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(inventoryPage.urlPattern);
    await expect(inventoryPage.readyLocator).toBeVisible();

    await page.context().storageState({ path: storageStatePath(role) });
  });
}
