// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildRetryPolicy(config: {
  attempts: number;
  backoffMs: number;
  backoffMultiplier?: number;
  maxBackoffMs?: number;
  retryableStatuses?: number[];
}): {
  shouldRetry: (attempt: number, statusCode: number) => boolean;
  delayMs: (attempt: number) => number;
} {
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  const { attempts, backoffMs, backoffMultiplier, maxBackoffMs, retryableStatuses } = config as {
    attempts: unknown;
    backoffMs: unknown;
    backoffMultiplier?: unknown;
    maxBackoffMs?: unknown;
    retryableStatuses?: unknown;
  };

  if (!Number.isInteger(attempts) || (attempts as number) < 1) {
    throw new RangeError('attempts must be a positive integer');
  }

  if (
    typeof backoffMs !== 'number' ||
    !Number.isFinite(backoffMs) ||
    backoffMs <= 0
  ) {
    throw new RangeError('backoffMs must be a positive finite number');
  }

  const resolvedBackoffMultiplier =
    backoffMultiplier !== undefined ? backoffMultiplier : 2;

  if (
    backoffMultiplier !== undefined &&
    (typeof backoffMultiplier !== 'number' ||
      !Number.isFinite(backoffMultiplier) ||
      backoffMultiplier < 1)
  ) {
    throw new RangeError('backoffMultiplier must be >= 1');
  }

  const resolvedMaxBackoffMs =
    maxBackoffMs !== undefined ? maxBackoffMs : 30000;

  if (
    maxBackoffMs !== undefined &&
    (typeof maxBackoffMs !== 'number' ||
      !Number.isFinite(maxBackoffMs) ||
      maxBackoffMs < backoffMs)
  ) {
    throw new RangeError('maxBackoffMs must be >= backoffMs');
  }

  const resolvedRetryableStatuses: number[] =
    retryableStatuses !== undefined
      ? (retryableStatuses as number[])
      : [429, 500, 502, 503, 504];

  const resolvedAttempts = attempts as number;

  return {
    shouldRetry(attempt: number, statusCode: number): boolean {
      if (attempt >= resolvedAttempts - 1) {
        return false;
      }
      return resolvedRetryableStatuses.some((s) => s === statusCode);
    },
    delayMs(attempt: number): number {
      return Math.min(
        backoffMs * Math.pow(resolvedBackoffMultiplier, attempt),
        resolvedMaxBackoffMs
      );
    },
  };
}