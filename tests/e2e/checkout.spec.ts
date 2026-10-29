// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import { PRODUCTS, TAX_RATE } from '@utils/catalog';
import { buildCheckoutInfo } from '@utils/builders';
import { formatMoney, roundMoney } from '@utils/money';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Checkout', () => {
  const basket = [PRODUCTS.backpack, PRODUCTS.boltTShirt];
  const subtotal = roundMoney(basket.reduce((sum, p) => sum + p.price, 0));
  const tax = roundMoney(subtotal * TAX_RATE);

  test.beforeEach(async ({ seedCart }) => {
    const cart = await seedCart(...basket);
    await cart.checkout();
  });

  test(
    'completes an order end to end',
    { tag: [TAG.smoke, TAG.destructive] },
    async ({ page, checkoutInformationPage, checkoutOverviewPage, checkoutCompletePage }) => {
      await checkoutInformationPage.waitUntilReady();
      await checkoutInformationPage.submit(buildCheckoutInfo());

      await checkoutOverviewPage.waitUntilReady();
      await expect(checkoutOverviewPage.items.names).toHaveText(basket.map((p) => p.name));

      await checkoutOverviewPage.finish();

      await expect(page).toHaveURL(checkoutCompletePage.urlPattern);
      await expect(checkoutCompletePage.confirmationHeading).toBeVisible();
      await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
    },
  );

  test(
    'overview shows correct subtotal, tax and total',
    { tag: [TAG.regression] },
    async ({ checkoutInformationPage, checkoutOverviewPage }) => {
      await checkoutInformationPage.submit(buildCheckoutInfo());
      await checkoutOverviewPage.waitUntilReady();

      await expect(checkoutOverviewPage.subtotalLabel).toHaveText(`Item total: ${formatMoney(subtotal)}`);
      await expect(checkoutOverviewPage.taxLabel).toHaveText(`Tax: ${formatMoney(tax)}`);
      await expect(checkoutOverviewPage.totalLabel).toHaveText(`Total: ${formatMoney(subtotal + tax)}`);
    },
  );

  const requiredFields = [
    { field: 'first name', info: { firstName: '' }, error: 'Error: First Name is required' },
    { field: 'last name', info: { lastName: '' }, error: 'Error: Last Name is required' },
    { field: 'postal code', info: { postalCode: '' }, error: 'Error: Postal Code is required' },
  ];

  for (const { field, info, error } of requiredFields) {
    test(`requires ${field}`, { tag: [TAG.regression] }, async ({ page, checkoutInformationPage }) => {
      await checkoutInformationPage.submit(buildCheckoutInfo(info));

      await expect(checkoutInformationPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(checkoutInformationPage.urlPattern);
    });
  }
});
