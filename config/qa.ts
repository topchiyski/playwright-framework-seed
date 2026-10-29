import type { DeepPartial, EnvironmentProfile } from '../src/types/config.types';

/** QA: fast feedback, verbose logs, destructive tests allowed. */
export const qaProfile: DeepPartial<EnvironmentProfile> = {
  logLevel: 'debug',
};
