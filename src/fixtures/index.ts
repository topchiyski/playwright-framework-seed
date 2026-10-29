import { mergeTests } from '@playwright/test';
import { env } from '@config/env';
import { TAG } from '@utils/tags';
import { test as apiTest } from './api.fixtures';
import { test as pageTest } from './page.fixtures';

/**
 * The ONLY `test` specs should import. Combines page, auth and API fixtures and adds
 * framework-wide guards. Import `expect` from here too, never from `@playwright/test`.
 */
export const test = mergeTests(pageTest, apiTest).extend<{ environmentGuard: void }>({
  environmentGuard: [
    async ({}, use, testInfo) => {
      testInfo.skip(
        testInfo.tags.includes(TAG.destructive) && !env.allowDestructive,
        `@destructive tests are disabled in "${env.name}"`,
      );
      testInfo.annotations.push({ type: 'environment', description: env.name });
      await use();
    },
    { auto: true },
  ],
});

export { expect } from './matchers';
export { TAG } from '@utils/tags';
