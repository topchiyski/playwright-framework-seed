import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api.client';
import { AuthTokenSchema } from './schemas/booking.schema';

export interface ApiCredentials {
  username: string;
  password: string;
}

export class AuthApi extends BaseApiClient {
  createTokenResponse(credentials: ApiCredentials): Promise<APIResponse> {
    return this.send('POST', '/auth', { data: credentials });
  }

  /** Returns a session token. Throws `ApiError` if the credentials are rejected. */
  async createToken(credentials: ApiCredentials): Promise<string> {
    const { token } = await this.parse(await this.createTokenResponse(credentials), AuthTokenSchema);
    return token;
  }
}
