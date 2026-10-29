/**
 * The user personas of the application under test. Usernames live in `config/default.ts`.
 * App-owned: `npm run init:project` replaces this file with a skeleton.
 */

/** Every persona the tests know about. */
export const USER_ROLES = ['standard', 'performanceGlitch', 'lockedOut'] as const;

/** Personas that can sign in; `tests/auth.setup.ts` saves a session for each of them. */
export const AUTH_ROLES = [
  'standard',
  'performanceGlitch',
] as const satisfies readonly (typeof USER_ROLES)[number][];

/** Session a test starts with unless it calls `test.use({ role })`. */
export const DEFAULT_ROLE: (typeof AUTH_ROLES)[number] | 'anonymous' = 'standard';
