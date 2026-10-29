import { expect, TAG, test } from '@fixtures/index';

test.describe('Home page', () => {
  test('shows the main heading', { tag: [TAG.smoke] }, async ({ homePage }) => {
    await homePage.goto();

    await expect(homePage.heading).toHaveText('Your application under test');
  });
});
