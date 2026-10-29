// Demo app (SauceDemo + Restful-Booker). `npm run init:project` replaces this file with a skeleton.
import { AuthApi } from '@api/auth.api';
import { BookingApi } from '@api/booking.api';
import type { BookingPayload, CreatedBooking } from '@api/schemas/booking.schema';
import { env } from '@config/env';
import type { Product } from '@app-types/product.types';
import {
  CartPage,
  CheckoutCompletePage,
  CheckoutInformationPage,
  CheckoutOverviewPage,
  InventoryPage,
  LoginPage,
  type BasePage,
} from '@pages/index';
import { buildBooking } from '@utils/builders';
import { test as base } from './base.fixtures';

const CART_STORAGE_KEY = 'cart-contents';

/**
 * Application-specific fixtures. Every fixture here is built on the framework fixtures in
 * `base.fixtures.ts` (`role`, `cleanup`, `apiRequest`).
 */
type AppFixtures = {
  /**
   * Signs in through the UI and resolves with the page the user lands on once it is ready.
   * Used only by `tests/auth.setup.ts` to save each persona's session.
   */
  authenticate: (credentials: { username: string; password: string }) => Promise<BasePage>;

  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  /** Seeds the cart directly in app storage (no UI clicks), then leaves the page on the cart. */
  seedCart: (...products: Product[]) => Promise<CartPage>;

  authApi: AuthApi;
  /** Booking client authenticated with the worker's admin token. */
  bookingApi: BookingApi;
  /** Creates a booking via the API and auto-deletes it after the test. */
  createBooking: (overrides?: Partial<BookingPayload>) => Promise<CreatedBooking>;
};

type AppWorkerFixtures = {
  /** Admin token fetched once per worker and reused by every test in it. */
  apiToken: string;
};

export const test = base.extend<AppFixtures, AppWorkerFixtures>({
  authenticate: async ({ loginPage, inventoryPage }, use) => {
    await use(async ({ username, password }) => {
      await loginPage.goto();
      await loginPage.login(username, password);
      return inventoryPage.waitUntilReady();
    });
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

  apiToken: [
    async ({ apiRequest }, use) => {
      const token = await new AuthApi(apiRequest).createToken({
        username: env.credentials.apiUsername,
        password: env.credentials.apiPassword,
      });
      await use(token);
    },
    { scope: 'worker' },
  ],

  authApi: async ({ apiRequest }, use) => use(new AuthApi(apiRequest)),

  bookingApi: async ({ apiRequest, apiToken }, use) => use(new BookingApi(apiRequest, apiToken)),

  createBooking: async ({ bookingApi, cleanup }, use) => {
    await use(async (overrides = {}) => {
      const created = await bookingApi.create(buildBooking(overrides));
      cleanup.register(`booking #${created.bookingid}`, () => bookingApi.deleteIfExists(created.bookingid));
      return created;
    });
  },
});
