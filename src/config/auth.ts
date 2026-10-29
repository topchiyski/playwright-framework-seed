import path from 'node:path';
import type { AuthRole, UserRole } from '@app-types/config.types';
import { env } from './env';

export const AUTH_DIR = path.resolve(__dirname, '..', '..', '.auth');

/** Location of the pre-authenticated storage state for a persona (written by `tests/auth.setup.ts`). */
export function storageStatePath(role: AuthRole): string {
  return path.join(AUTH_DIR, `${role}.json`);
}

export function credentialsFor(role: UserRole): { username: string; password: string } {
  return { username: env.users[role], password: env.credentials.uiPassword };
}
