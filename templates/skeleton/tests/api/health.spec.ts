import { HealthSchema } from '@api/schemas/health.schema';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Health API', () => {
  test('reports healthy', { tag: [TAG.smoke, TAG.contract] }, async ({ healthApi }) => {
    const response = await healthApi.checkResponse();

    await expect(response).toHaveStatus(200);
    const body: unknown = await response.json();
    expect(body).toMatchSchema(HealthSchema);
  });
});
