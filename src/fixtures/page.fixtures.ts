import { test as base } from '@playwright/test';
import { storageStatePath } from '@config/auth';
import type { AuthRole } from '@app-types/config.types';
import {
  CartPage,
  CheckoutCompletePage,
  CheckoutInformationPage,
  CheckoutOverviewPage,
  InventoryPage,
  LoginPage,
} from '@pages/index';
import type { Product } from '@app-types/product.types';

const CART_STORAGE_KEY = 'cart-contents';

type PageOptions = {
  /**
   * Which persona's pre-built session the browser context starts with.
   * `'anonymous'` starts logged out. Override per file/describe with `test.use({ role: ... })`.
   */
  role: AuthRole | 'anonymous';
};

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  /**
   * Seeds the cart directly in app storage (no UI clicks), then leaves the page on the cart.
   * Use it to set up state that is not under test.
   */
  seedCart: (...products: Product[]) => Promise<CartPage>;
};

export const test = base.extend<PageOptions & PageFixtures>({
  role: ['standard', { option: true }],

  storageState: async ({ role }, use) => {
    await use(role === 'anonymous' ? { cookies: [], origins: [] } : storageStatePath(role));
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),

  seedCart: async ({ page, inventoryPage, cartPage }, use) => {
    await use(async (...products) => {
      await inventoryPage.goto(); // establish the origin so localStorage is writable
      await page.evaluate(([key, ids]) => window.localStorage.setItem(key, JSON.stringify(ids)), [
        CART_STORAGE_KEY,
        products.map((p) => p.id),
      ] as const);
      return cartPage.goto();
    });
  },
});
