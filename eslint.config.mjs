// @ts-check
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

const noHardWaits = {
  selector: "CallExpression[callee.property.name='waitForTimeout']",
  message: 'Hard waits are banned. Wait for a concrete condition (locator state, URL, response).',
};

export default tseslint.config(
  { ignores: ['node_modules/**', 'reports/**', 'allure-results/**', 'test-results/**', '.auth/**'] },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-syntax': ['error', noHardWaits],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-pattern': 'off',
      'no-empty-pattern': 'off', // Playwright fixtures use `async ({}, use) => …`
    },
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },

  // Page Objects and API clients expose behaviour; they never assert.
  {
    files: ['src/pages/**/*.ts', 'src/api/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect', 'test'],
              message:
                'Pages/API clients must not assert or declare tests. Return data/locators; assert in specs.',
            },
          ],
        },
      ],
    },
  },

  // Specs go through the framework fixtures so auth, cleanup and guards always apply.
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/expect-expect': ['error', { assertFunctionNames: ['expect'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              message: "Import { test, expect } from '@fixtures/index' instead.",
            },
          ],
        },
      ],
    },
  },
);
