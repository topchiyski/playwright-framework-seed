// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import { credentialsFor } from '@config/auth';
import { env } from '@config/env';
import { expect, TAG, test } from '@fixtures/index';

// The login screen itself is under test here, so these specs start logged out.
test.use({ role: 'anonymous' });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'standard user lands on the inventory',
    { tag: [TAG.smoke] },
    async ({ page, loginPage, inventoryPage }) => {
      const { username, password } = credentialsFor('standard');

      await loginPage.login(username, password);

      await expect(page).toHaveURL(inventoryPage.urlPattern);
      await expect(inventoryPage.header.title).toHaveText('Products');
    },
  );

  const rejections = [
    {
      scenario: 'locked-out user',
      username: env.users.lockedOut,
      password: env.credentials.uiPassword,
      error: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
      scenario: 'wrong password',
      username: env.users.standard,
      password: 'definitely-wrong',
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      scenario: 'missing username',
      username: '',
      password: env.credentials.uiPassword,
      error: 'Epic sadface: Username is required',
    },
    {
      scenario: 'missing password',
      username: env.users.standard,
      password: '',
      error: 'Epic sadface: Password is required',
    },
  ];

  for (const { scenario, username, password, error } of rejections) {
    test(`rejects ${scenario}`, { tag: [TAG.regression] }, async ({ page, loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(loginPage.urlPattern);
    });
  }

  test('blocks direct access to protected pages', { tag: [TAG.regression] }, async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in",
    );
  });
});
