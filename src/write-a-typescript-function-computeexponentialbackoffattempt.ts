// bloom-deps:

export function computeExponentialBackoff(attempt: unknown, baseMs: unknown, maxMs: unknown): number {
  if (typeof attempt !== 'number' || !Number.isFinite(attempt)) {
    throw new TypeError('attempt must be a finite number');
  }
  if (typeof baseMs !== 'number' || !Number.isFinite(baseMs)) {
    throw new TypeError('baseMs must be a finite number');
  }
  if (typeof maxMs !== 'number' || !Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }

  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new RangeError('attempt must be a non-negative integer');
  }
  if (!Number.isInteger(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive integer');
  }
  if (!Number.isInteger(maxMs) || maxMs <= 0) {
    throw new RangeError('maxMs must be a positive integer');
  }

  const computed = baseMs * Math.pow(2, attempt);
  const delay = Math.min(computed, maxMs);
  return Math.floor(delay);
}