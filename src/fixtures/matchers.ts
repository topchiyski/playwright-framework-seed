import { expect as baseExpect, type APIResponse } from '@playwright/test';
import { z } from 'zod';

/**
 * Framework-specific matchers. Prefer these over hand-rolled `if`/`throw` checks so
 * failures render as proper assertion diffs in HTML/Allure reports.
 */
export const expect = baseExpect.extend({
  /**
   * `expect(json).toMatchSchema(BookingSchema)` — structural contract check with readable Zod errors.
   * Type the received value as `unknown` (not `any`), or Playwright hides custom matchers from the type.
   */
  toMatchSchema(received: unknown, schema: z.ZodType) {
    const result = schema.safeParse(received);
    return {
      pass: result.success,
      name: 'toMatchSchema',
      message: () =>
        result.success
          ? `${this.utils.printReceived(received)}\nexpected NOT to match schema`
          : `Response does not match schema:\n${z.prettifyError(result.error)}\n\nReceived: ${this.utils.printReceived(received)}`,
    };
  },

  /** `await expect(response).toHaveStatus(201)` — includes the response body in the failure message. */
  async toHaveStatus(response: APIResponse, expected: number) {
    const actual = response.status();
    const pass = actual === expected;
    const body = pass ? '' : await response.text().catch(() => '<unreadable body>');
    return {
      pass,
      name: 'toHaveStatus',
      expected,
      actual,
      message: () =>
        `${response.url()}\n` +
        `Expected status: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expected)}\n` +
        `Received status: ${this.utils.printReceived(actual)}` +
        (body ? `\nBody: ${body.slice(0, 500)}` : ''),
    };
  },
});
