// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function computeExponentialBackoff(
  attempt: unknown,
  baseMs: unknown,
  maxMs: unknown
): number {
  // Validate that all arguments are finite numbers
  if (typeof attempt !== 'number' || !Number.isFinite(attempt)) {
    throw new TypeError('attempt must be a finite number');
  }
  if (typeof baseMs !== 'number' || !Number.isFinite(baseMs)) {
    throw new TypeError('baseMs must be a finite number');
  }
  if (typeof maxMs !== 'number' || !Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }

  // Validate attempt is a non-negative integer
  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new RangeError('attempt must be a non-negative integer');
  }

  // Validate baseMs is a positive integer
  if (!Number.isInteger(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive integer');
  }

  // Validate maxMs is a positive integer
  if (!Number.isInteger(maxMs) || maxMs <= 0) {
    throw new RangeError('maxMs must be a positive integer');
  }

  // Compute delay using exponential backoff formula
  const computedDelay = baseMs * Math.pow(2, attempt);

  // Clamp to maxMs and floor the result
  const delay = Math.min(computedDelay, maxMs);
  return Math.floor(delay);
}