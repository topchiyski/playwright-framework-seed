import { AUTH_ROLES, DEFAULT_ROLE, USER_ROLES } from '../../config/personas';

export const ENVIRONMENTS = ['qa', 'staging', 'prod'] as const;
export type EnvironmentName = (typeof ENVIRONMENTS)[number];

// Personas are app-owned and defined in config/personas.ts.
export { AUTH_ROLES, DEFAULT_ROLE, USER_ROLES };
export type UserRole = (typeof USER_ROLES)[number];
export type AuthRole = (typeof AUTH_ROLES)[number];
/** A persona with a saved session, or a logged-out context. */
export type SessionRole = AuthRole | 'anonymous';

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Non-secret, per-environment settings. Lives in `config/<env>.ts`.
 * Secrets (passwords, tokens) are never part of a profile — they come from `.env` / CI secrets.
 */
export interface EnvironmentProfile {
  baseUrl: string;
  apiBaseUrl: string;
  users: Record<UserRole, string>;
  /** Attribute `getByTestId()` matches, e.g. `data-testid` (Playwright default) or `data-test`. */
  testIdAttribute: string;
  /** Command Playwright runs to start the app before tests; omit when testing a deployed app. */
  webServer?: {
    command: string;
    /** Polled until it answers; tests start afterwards. */
    url: string;
  };
  timeouts: {
    /** Per-test timeout (ms). */
    test: number;
    /** Web-first assertion timeout (ms). */
    expect: number;
    /** Single action (click/fill) timeout (ms). */
    action: number;
    /** page.goto / waitForURL timeout (ms). */
    navigation: number;
  };
  workers: number;
  retries: number;
  headless: boolean;
  /** When false, tests tagged `@destructive` are skipped (e.g. in prod). */
  allowDestructive: boolean;
  logLevel: LogLevel;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
