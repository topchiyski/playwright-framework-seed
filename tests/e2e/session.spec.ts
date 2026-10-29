// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import { ALL_PRODUCTS } from '@utils/catalog';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Session', () => {
  test('logout ends the session', { tag: [TAG.smoke] }, async ({ page, inventoryPage, loginPage }) => {
    await inventoryPage.goto();

    const menu = await inventoryPage.header.openMenu();
    await menu.logout();

    await expect(page).toHaveURL(loginPage.urlPattern);
    await expect(loginPage.loginButton).toBeVisible();

    await page.goto('/inventory.html');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test.describe('as performance-glitch user', () => {
    // Different persona, same pre-built auth mechanism — no UI login in the test.
    test.use({ role: 'performanceGlitch' });

    test(
      'inventory eventually renders without hard waits',
      { tag: [TAG.regression] },
      async ({ inventoryPage }) => {
        await inventoryPage.goto();

        await expect(inventoryPage.products.cards).toHaveCount(ALL_PRODUCTS.length);
      },
    );
  });
});
