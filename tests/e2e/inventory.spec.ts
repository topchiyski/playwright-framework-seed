// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { SortOption } from '@app-types/product.types';
import { ALL_PRODUCTS, PRODUCTS } from '@utils/catalog';
import { formatMoney } from '@utils/money';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('lists the full catalog with correct prices', { tag: [TAG.smoke] }, async ({ inventoryPage }) => {
    await expect(inventoryPage.products.cards).toHaveCount(ALL_PRODUCTS.length);

    const displayed = await inventoryPage.products.readAll();
    expect(displayed).toEqual(
      expect.arrayContaining(ALL_PRODUCTS.map(({ name, price }) => ({ name, price }))),
    );
  });

  const names = ALL_PRODUCTS.map((p) => p.name).sort((a, b) => a.localeCompare(b));
  const prices = ALL_PRODUCTS.map((p) => p.price).sort((a, b) => a - b);
  // Price ties have no guaranteed order, so price sorts compare the price column, not names.
  const sortCases: { option: SortOption; column: 'names' | 'prices'; expected: string[] }[] = [
    { option: 'nameAsc', column: 'names', expected: names },
    { option: 'nameDesc', column: 'names', expected: [...names].reverse() },
    { option: 'priceAsc', column: 'prices', expected: prices.map(formatMoney) },
    { option: 'priceDesc', column: 'prices', expected: [...prices].reverse().map(formatMoney) },
  ];

  for (const { option, column, expected } of sortCases) {
    test(`sorts products by ${option}`, { tag: [TAG.regression] }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      await expect(inventoryPage.products[column]).toHaveText(expected);
    });
  }

  test(
    'adding and removing items updates the cart badge',
    { tag: [TAG.smoke] },
    async ({ inventoryPage }) => {
      const { header } = inventoryPage;
      await expect(header.cartBadge).toBeHidden();

      await inventoryPage.addToCart(PRODUCTS.backpack.name, PRODUCTS.onesie.name);
      await expect(header.cartBadge).toHaveText('2');

      const backpack = inventoryPage.products.byName(PRODUCTS.backpack.name);
      await expect(backpack.removeButton).toBeVisible();
      await backpack.remove();

      await expect(header.cartBadge).toHaveText('1');
      await expect(backpack.addToCartButton).toBeVisible();
    },
  );
});
