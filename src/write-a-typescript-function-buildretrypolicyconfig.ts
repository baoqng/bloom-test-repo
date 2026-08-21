// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
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

  const { attempts, backoffMs } = config;

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new RangeError('attempts must be a positive integer');
  }

  if (typeof backoffMs !== 'number' || !Number.isFinite(backoffMs) || backoffMs <= 0) {
    throw new RangeError('backoffMs must be a positive finite number');
  }

  const backoffMultiplier = config.backoffMultiplier !== undefined ? config.backoffMultiplier : 2;

  if (config.backoffMultiplier !== undefined) {
    if (typeof backoffMultiplier !== 'number' || !Number.isFinite(backoffMultiplier) || backoffMultiplier < 1) {
      throw new RangeError('backoffMultiplier must be >= 1');
    }
  }

  const maxBackoffMs = config.maxBackoffMs !== undefined ? config.maxBackoffMs : 30000;

  if (config.maxBackoffMs !== undefined) {
    if (typeof maxBackoffMs !== 'number' || !Number.isFinite(maxBackoffMs) || maxBackoffMs < backoffMs) {
      throw new RangeError('maxBackoffMs must be >= backoffMs');
    }
  }

  const retryableStatuses = config.retryableStatuses !== undefined
    ? config.retryableStatuses
    : [429, 500, 502, 503, 504];

  return {
    shouldRetry(attempt: number, statusCode: number): boolean {
      if (attempt >= attempts - 1) return false;
      return retryableStatuses.includes(statusCode);
    },
    delayMs(attempt: number): number {
      return Math.min(backoffMs * Math.pow(backoffMultiplier, attempt), maxBackoffMs);
    },
  };
}