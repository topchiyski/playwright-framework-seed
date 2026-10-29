// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import { AuthTokenSchema } from '@api/schemas/booking.schema';
import { env } from '@config/env';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Auth API', () => {
  test('issues a token for valid credentials', { tag: [TAG.smoke, TAG.contract] }, async ({ authApi }) => {
    const response = await authApi.createTokenResponse({
      username: env.credentials.apiUsername,
      password: env.credentials.apiPassword,
    });

    await expect(response).toHaveStatus(200);
    const body: unknown = await response.json();
    expect(body).toMatchSchema(AuthTokenSchema);
  });

  test('rejects invalid credentials', { tag: [TAG.regression] }, async ({ authApi }) => {
    const response = await authApi.createTokenResponse({ username: 'admin', password: 'wrong-password' });

    // Restful-Booker signals auth failure in the body, not via status code.
    await expect(response).toHaveStatus(200);
    expect(await response.json()).toEqual({ reason: 'Bad credentials' });
  });
});
