/**
 * The user personas of the application under test. Usernames live in `config/default.ts`.
 */

/** Every persona the tests know about. */
export const USER_ROLES = ['user'] as const;

/**
 * Personas that can sign in; `tests/auth.setup.ts` saves a session for each of them.
 * TODO: add 'user' here once `authenticate` in src/fixtures/app.fixtures.ts signs in.
 */
export const AUTH_ROLES = [] as const satisfies readonly (typeof USER_ROLES)[number][];

/** Session a test starts with unless it calls `test.use({ role })`. Switch to 'user' with AUTH_ROLES. */
export const DEFAULT_ROLE: (typeof AUTH_ROLES)[number] | 'anonymous' = 'anonymous';
