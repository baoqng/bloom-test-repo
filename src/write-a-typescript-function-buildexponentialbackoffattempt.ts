// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function buildExponentialBackoff(
  attempt: number,
  baseMs: number,
  maxMs: number
): number {
  // Validate that all arguments are finite numbers
  if (!Number.isFinite(attempt)) {
    throw new TypeError('attempt must be a finite number');
  }
  if (!Number.isFinite(baseMs)) {
    throw new TypeError('baseMs must be a finite number');
  }
  if (!Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }

  // Validate attempt is a non-negative integer
  if (!Number.isInteger(attempt)) {
    throw new RangeError('attempt must be an integer');
  }
  if (attempt < 0) {
    throw new RangeError('attempt must be non-negative');
  }

  // Validate baseMs is a positive integer
  if (!Number.isInteger(baseMs)) {
    throw new RangeError('baseMs must be an integer');
  }
  if (baseMs <= 0) {
    throw new RangeError('baseMs must be a positive integer');
  }

  // Validate maxMs is a positive integer and >= baseMs
  if (!Number.isInteger(maxMs)) {
    throw new RangeError('maxMs must be an integer');
  }
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be greater than or equal to baseMs');
  }

  // Calculate exponential backoff: baseMs * 2^attempt
  const exponentialValue = baseMs * Math.pow(2, attempt);

  // Clamp to maxMs and floor to integer
  const clampedValue = Math.min(exponentialValue, maxMs);
  const result = Math.floor(clampedValue);

  return result;
}