// bloom-deps:

function isPlainObject(x: unknown): x is Record<string, unknown> {
  if (x === null) return false;
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return false;
  return Object.getPrototypeOf(x) === Object.prototype;
}

export function buildRetryPolicy(config: unknown): {
  shouldRetry: (attempt: number, error: Error) => boolean;
  delayMs: (attempt: number) => number;
} {
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  // maxAttempts
  let maxAttempts = 3;
  if ('maxAttempts' in config && config['maxAttempts'] !== undefined) {
    const ma = config['maxAttempts'];
    if (
      typeof ma !== 'number' ||
      !Number.isInteger(ma) ||
      ma <= 0
    ) {
      throw new TypeError('maxAttempts must be a positive integer');
    }
    maxAttempts = ma;
  }

  // backoffMs
  let backoffMs = 100;
  if ('backoffMs' in config && config['backoffMs'] !== undefined) {
    const bms = config['backoffMs'];
    if (
      typeof bms !== 'number' ||
      !Number.isInteger(bms) ||
      bms <= 0
    ) {
      throw new TypeError('backoffMs must be a positive integer');
    }
    backoffMs = bms;
  }

  // maxBackoffMs
  let maxBackoffMs = 30000;
  if ('maxBackoffMs' in config && config['maxBackoffMs'] !== undefined) {
    const mbms = config['maxBackoffMs'];
    if (
      typeof mbms !== 'number' ||
      !Number.isInteger(mbms) ||
      mbms <= 0
    ) {
      throw new TypeError('maxBackoffMs must be a positive integer');
    }
    maxBackoffMs = mbms;
  }

  // retryOn
  let retryOn: Array<(new (...args: unknown[]) => Error) | string> | null = null;
  if ('retryOn' in config && config['retryOn'] !== undefined) {
    if (!Array.isArray(config['retryOn'])) {
      throw new TypeError('retryOn must be an array');
    }
    retryOn = config['retryOn'] as Array<(new (...args: unknown[]) => Error) | string>;
  }

  function shouldRetry(attempt: number, error: Error): boolean {
    if (attempt >= maxAttempts) {
      return false;
    }

    if (retryOn === null) {
      // Default: retry all errors
      return true;
    }

    for (const entry of retryOn) {
      if (typeof entry === 'string') {
        if (error.message === entry) {
          return true;
        }
      } else if (typeof entry === 'function') {
        if (error instanceof entry) {
          return true;
        }
      }
    }

    return false;
  }

  function delayMs(attempt: number): number {
    return Math.min(backoffMs * Math.pow(2, attempt), maxBackoffMs);
  }

  return { shouldRetry, delayMs };
}