import { env } from '@config/env';
import { LOG_LEVELS, type LogLevel } from '@app-types/config.types';

const threshold = LOG_LEVELS.indexOf(env.logLevel);

function log(level: LogLevel, scope: string, message: string, meta?: unknown): void {
  if (LOG_LEVELS.indexOf(level) < threshold) return;
  const line = `[${new Date().toISOString()}] ${level.toUpperCase().padEnd(5)} [${scope}] ${message}`;
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  if (meta === undefined) sink(line);
  else sink(line, meta);
}

/** Scoped, level-filtered logger. Level comes from `env.logLevel` (LOG_LEVEL). */
export function createLogger(scope: string) {
  return {
    debug: (message: string, meta?: unknown) => log('debug', scope, message, meta),
    info: (message: string, meta?: unknown) => log('info', scope, message, meta),
    warn: (message: string, meta?: unknown) => log('warn', scope, message, meta),
    error: (message: string, meta?: unknown) => log('error', scope, message, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;
