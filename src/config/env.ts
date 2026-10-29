import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { defaultProfile } from '../../config/default';
import { prodProfile } from '../../config/prod';
import { qaProfile } from '../../config/qa';
import { stagingProfile } from '../../config/staging';
import {
  ENVIRONMENTS,
  LOG_LEVELS,
  USER_ROLES,
  type DeepPartial,
  type EnvironmentName,
  type EnvironmentProfile,
} from '../types/config.types';

const ROOT_DIR = path.resolve(__dirname, '..', '..');

const PROFILES: Record<EnvironmentName, DeepPartial<EnvironmentProfile>> = {
  qa: qaProfile,
  staging: stagingProfile,
  prod: prodProfile,
};

const positiveInt = z.coerce.number().int().positive();
const booleanish = z.union([z.boolean(), z.stringbool()]);

const EnvSchema = z.object({
  name: z.enum(ENVIRONMENTS),
  baseUrl: z.url(),
  apiBaseUrl: z.url(),
  users: z.object(
    Object.fromEntries(USER_ROLES.map((role) => [role, z.string().min(1)])) as {
      [K in (typeof USER_ROLES)[number]]: z.ZodString;
    },
  ),
  credentials: z.object({
    uiPassword: z.string({ error: 'UI_PASSWORD is required' }).min(1),
    apiUsername: z.string({ error: 'API_USERNAME is required' }).min(1),
    apiPassword: z.string({ error: 'API_PASSWORD is required' }).min(1),
  }),
  timeouts: z.object({
    test: positiveInt,
    expect: positiveInt,
    action: positiveInt,
    navigation: positiveInt,
  }),
  workers: positiveInt,
  retries: z.coerce.number().int().min(0).max(3),
  headless: booleanish,
  allowDestructive: booleanish,
  logLevel: z.enum(LOG_LEVELS),
  isCI: z.boolean(),
});

export type Env = z.infer<typeof EnvSchema>;

/** Reads a dotenv file without mutating `process.env`. Missing files are fine. */
function readEnvFile(fileName: string): Record<string, string> {
  const filePath = path.join(ROOT_DIR, fileName);
  return fs.existsSync(filePath) ? dotenv.parse(fs.readFileSync(filePath)) : {};
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: DeepPartial<T>): T {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }
  return result as T;
}

/** Drops keys whose value is undefined so they don't clobber profile values during the merge. */
function defined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function loadEnv(): Env {
  // Precedence (highest first): real process env > .env.<TEST_ENV> > .env > config/<env>.ts > config/default.ts
  const shared = readEnvFile('.env');
  const envName = z
    .enum(ENVIRONMENTS, { error: `TEST_ENV must be one of: ${ENVIRONMENTS.join(', ')}` })
    .parse(process.env.TEST_ENV ?? shared.TEST_ENV ?? 'qa');
  const raw: Record<string, string | undefined> = {
    ...shared,
    ...readEnvFile(`.env.${envName}`),
    ...process.env,
  };

  const profile = deepMerge(defaultProfile as unknown as Record<string, unknown>, PROFILES[envName]);

  const candidate = deepMerge(profile, {
    ...defined({
      baseUrl: raw.BASE_URL,
      apiBaseUrl: raw.API_BASE_URL,
      workers: raw.WORKERS,
      retries: raw.RETRIES,
      headless: raw.HEADLESS,
      logLevel: raw.LOG_LEVEL,
    }),
    name: envName,
    credentials: {
      uiPassword: raw.UI_PASSWORD,
      apiUsername: raw.API_USERNAME,
      apiPassword: raw.API_PASSWORD,
    },
    isCI: Boolean(raw.CI),
  });

  const result = EnvSchema.safeParse(candidate);
  if (!result.success) {
    throw new Error(
      `Invalid test configuration for TEST_ENV="${envName}":\n${z.prettifyError(result.error)}\n` +
        'Copy .env.example to .env and fill in the missing values.',
    );
  }
  return Object.freeze(result.data);
}

/** Validated, immutable runtime configuration. Import this — never read `process.env` directly. */
export const env: Env = loadEnv();
