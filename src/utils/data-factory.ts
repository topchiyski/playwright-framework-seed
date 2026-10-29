import { randomUUID } from 'node:crypto';

/**
 * App-independent building blocks for test data. App-specific builders (complete payloads for
 * your API or forms) live in `builders.ts` and use these.
 */

/** Short unique suffix so parallel workers never collide on shared environments. */
export function uniqueId(prefix = 'pw'): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

/** ISO `YYYY-MM-DD` date `offsetDays` from today (UTC). */
export function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}
