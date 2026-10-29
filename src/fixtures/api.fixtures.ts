import { test as base, type APIRequestContext } from '@playwright/test';
import { AuthApi } from '@api/auth.api';
import { BookingApi } from '@api/booking.api';
import type { BookingPayload, CreatedBooking } from '@api/schemas/booking.schema';
import { env } from '@config/env';
import { CleanupRegistry } from '@utils/cleanup-registry';
import { buildBooking } from '@utils/data-factory';

type ApiWorkerFixtures = {
  /** One HTTP context per worker, pre-configured for the API base URL. */
  apiRequest: APIRequestContext;
  /** Admin token fetched once per worker and reused by every test in it. */
  apiToken: string;
};

type ApiTestFixtures = {
  authApi: AuthApi;
  /** Booking client authenticated with the worker's admin token. */
  bookingApi: BookingApi;
  /** Register teardown callbacks; they run LIFO after the test regardless of outcome. */
  cleanup: CleanupRegistry;
  /** Creates a booking via the API and auto-deletes it after the test. */
  createBooking: (overrides?: Partial<BookingPayload>) => Promise<CreatedBooking>;
};

export const test = base.extend<ApiTestFixtures, ApiWorkerFixtures>({
  apiRequest: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext({
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
        timeout: env.timeouts.navigation,
      });
      await use(context);
      await context.dispose();
    },
    { scope: 'worker' },
  ],

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

  authApi: async ({ apiRequest }, use) => {
    await use(new AuthApi(apiRequest));
  },

  bookingApi: async ({ apiRequest, apiToken }, use) => {
    await use(new BookingApi(apiRequest, apiToken));
  },

  cleanup: async ({}, use) => {
    const registry = new CleanupRegistry();
    await use(registry);
    await registry.runAll();
  },

  createBooking: async ({ bookingApi, cleanup }, use) => {
    await use(async (overrides = {}) => {
      const created = await bookingApi.create(buildBooking(overrides));
      cleanup.register(`booking #${created.bookingid}`, () => bookingApi.deleteIfExists(created.bookingid));
      return created;
    });
  },
});
