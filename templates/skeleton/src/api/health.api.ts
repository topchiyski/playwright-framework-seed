import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api.client';
import { HealthSchema, type Health } from './schemas/health.schema';

/** Example API client (sandbox health endpoint). Replace with your application's API clients. */
export class HealthApi extends BaseApiClient {
  checkResponse(): Promise<APIResponse> {
    return this.send('GET', '/api/health');
  }

  async check(): Promise<Health> {
    return this.parse(await this.checkResponse(), HealthSchema);
  }
}
