import type { DeepPartial, EnvironmentProfile } from '../src/types/config.types';

/** Staging: production-like; one retry to absorb shared-infra noise (retries are reported as flaky). */
export const stagingProfile: DeepPartial<EnvironmentProfile> = {
  retries: 1,
  timeouts: {
    expect: 15_000,
    navigation: 45_000,
  },
};
