import type { DeepPartial, EnvironmentProfile } from '../src/types/config.types';

/** Production: read-only smoke checks. `@destructive` tests are skipped, low concurrency. */
export const prodProfile: DeepPartial<EnvironmentProfile> = {
  workers: 2,
  retries: 1,
  allowDestructive: false,
  logLevel: 'warn',
};
