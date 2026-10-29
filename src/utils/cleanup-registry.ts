import { createLogger } from './logger';

type CleanupTask = { label: string; run: () => Promise<unknown> };

const logger = createLogger('cleanup');

/**
 * Collects teardown callbacks for data a test created and runs them LIFO after the test,
 * whether it passed or failed. Every task runs even if an earlier one throws; failures are
 * aggregated so a broken cleanup is visible instead of silently leaking data.
 */
export class CleanupRegistry {
  private readonly tasks: CleanupTask[] = [];

  register(label: string, run: () => Promise<unknown>): void {
    this.tasks.push({ label, run });
  }

  get size(): number {
    return this.tasks.length;
  }

  async runAll(): Promise<void> {
    const errors: Error[] = [];
    while (this.tasks.length > 0) {
      const task = this.tasks.pop()!;
      try {
        await task.run();
        logger.debug(`cleaned up: ${task.label}`);
      } catch (error) {
        logger.error(`cleanup failed: ${task.label}`, error);
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }
    if (errors.length > 0) {
      throw new AggregateError(errors, `${errors.length} cleanup task(s) failed`);
    }
  }
}
