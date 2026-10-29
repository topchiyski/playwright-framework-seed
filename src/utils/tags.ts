/**
 * Canonical test tags. Use via `test('...', { tag: [TAG.smoke] }, ...)` so the
 * grep-based npm scripts (`test:smoke`, `test:prod`) keep working.
 */
export const TAG = {
  smoke: '@smoke',
  regression: '@regression',
  /** Mutates data. Auto-skipped when `env.allowDestructive` is false (prod). */
  destructive: '@destructive',
  contract: '@contract',
} as const;
