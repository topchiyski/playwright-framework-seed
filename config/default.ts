import type { EnvironmentProfile } from '../src/types/config.types';

/**
 * Baseline profile. Environment files in this folder override only what differs.
 * Do NOT put secrets here — see `.env.example`.
 */
export const defaultProfile: EnvironmentProfile = {
  baseUrl: 'https://www.saucedemo.com',
  apiBaseUrl: 'https://restful-booker.herokuapp.com',
  users: {
    standard: 'standard_user',
    performanceGlitch: 'performance_glitch_user',
    lockedOut: 'locked_out_user',
  },
  timeouts: {
    test: 60_000,
    expect: 10_000,
    action: 15_000,
    navigation: 30_000,
  },
  workers: 4,
  retries: 0,
  headless: true,
  allowDestructive: true,
  logLevel: 'info',
};
