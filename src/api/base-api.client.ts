import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { z } from 'zod';
import { createLogger, type Logger } from '@utils/logger';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = NonNullable<Parameters<APIRequestContext['fetch']>[1]>;

/**
 * Base for typed API clients. Two layers per endpoint:
 *  - `*Response()` methods return the raw `APIResponse` for negative/status-code tests;
 *  - typed methods call `parse()`, which enforces a 2xx status and validates the body
 *    against a Zod schema, so contract drift fails loudly at the call site.
 * Clients never assert — they throw `ApiError`; assertions belong in specs.
 */
export abstract class BaseApiClient {
  protected readonly log: Logger;

  constructor(protected readonly request: APIRequestContext) {
    this.log = createLogger(this.constructor.name);
  }

  protected async send(method: string, url: string, options: RequestOptions = {}): Promise<APIResponse> {
    const started = Date.now();
    const response = await this.request.fetch(url, { ...options, method });
    this.log.debug(`${method} ${url} -> ${response.status()} (${Date.now() - started}ms)`);
    return response;
  }

  protected async parse<S extends z.ZodType>(response: APIResponse, schema: S): Promise<z.infer<S>> {
    const text = await response.text();
    const where = response.url();
    if (!response.ok()) {
      throw new ApiError(`${where} failed with ${response.status()}: ${text}`, response.status(), text);
    }
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      throw new ApiError(`${where} returned non-JSON body: ${text}`, response.status(), text);
    }
    const result = schema.safeParse(json);
    if (!result.success) {
      throw new ApiError(
        `${where} response violates contract: ${result.error.message}`,
        response.status(),
        text,
      );
    }
    return result.data;
  }
}
