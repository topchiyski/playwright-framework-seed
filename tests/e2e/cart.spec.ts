// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import { PRODUCTS } from '@utils/catalog';
import { formatMoney } from '@utils/money';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Cart', () => {
  test('shows seeded items with quantity and price', { tag: [TAG.smoke] }, async ({ seedCart }) => {
    const cart = await seedCart(PRODUCTS.backpack, PRODUCTS.fleeceJacket);

    await expect(cart.items.names).toHaveText([PRODUCTS.backpack.name, PRODUCTS.fleeceJacket.name]);
    const jacket = cart.items.byName(PRODUCTS.fleeceJacket.name);
    await expect(jacket.quantity).toHaveText('1');
    await expect(jacket.price).toHaveText(formatMoney(PRODUCTS.fleeceJacket.price));
    await expect(cart.header.cartBadge).toHaveText('2');
  });

  test('removing an item updates list and badge', { tag: [TAG.regression] }, async ({ seedCart }) => {
    const cart = await seedCart(PRODUCTS.backpack, PRODUCTS.bikeLight);

    await cart.removeItem(PRODUCTS.backpack.name);

    await expect(cart.items.names).toHaveText([PRODUCTS.bikeLight.name]);
    await expect(cart.header.cartBadge).toHaveText('1');
  });

  test(
    'continue shopping returns to the inventory',
    { tag: [TAG.regression] },
    async ({ page, seedCart, inventoryPage }) => {
      const cart = await seedCart(PRODUCTS.onesie);

      await cart.continueShopping();

      await expect(page).toHaveURL(inventoryPage.urlPattern);
      await expect(inventoryPage.products.byName(PRODUCTS.onesie.name).removeButton).toBeVisible();
    },
  );

  test('empty cart has no items and no badge', { tag: [TAG.regression] }, async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.items.cards).toHaveCount(0);
    await expect(cartPage.header.cartBadge).toBeHidden();
  });
});
