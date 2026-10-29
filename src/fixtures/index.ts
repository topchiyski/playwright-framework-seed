import { env } from '@config/env';
import { TAG } from '@utils/tags';
import { test as appTest } from './app.fixtures';

/**
 * The ONLY `test` specs should import. Layers: framework fixtures (`base.fixtures.ts`) →
 * application fixtures (`app.fixtures.ts`) → framework-wide guards (here).
 * Import `expect` from here too, never from `@playwright/test`.
 */
export const test = appTest.extend<{ environmentGuard: void }>({
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
