export const ENVIRONMENTS = ['qa', 'staging', 'prod'] as const;
export type EnvironmentName = (typeof ENVIRONMENTS)[number];

/** Every SauceDemo persona the framework knows about. */
export const USER_ROLES = ['standard', 'performanceGlitch', 'lockedOut'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Personas that can actually sign in and therefore get a pre-built storage state. */
export const AUTH_ROLES = ['standard', 'performanceGlitch'] as const satisfies readonly UserRole[];
export type AuthRole = (typeof AUTH_ROLES)[number];

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
