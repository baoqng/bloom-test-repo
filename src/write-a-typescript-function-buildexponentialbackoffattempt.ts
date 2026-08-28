// bloom-deps:

export function buildExponentialBackoff(attempt: number, baseMs: number, maxMs: number): number {
  if (!Number.isFinite(attempt) || !Number.isFinite(baseMs) || !Number.isFinite(maxMs)) {
    throw new TypeError('All arguments must be finite numbers');
  }

  if (attempt < 0 || !Number.isInteger(attempt)) {
    throw new RangeError('attempt must be a non-negative integer');
  }

  if (!Number.isInteger(baseMs) || baseMs < 1) {
    throw new RangeError('baseMs must be a positive integer');
  }

  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be greater than or equal to baseMs');
  }

  const result = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  return Math.floor(result);
}