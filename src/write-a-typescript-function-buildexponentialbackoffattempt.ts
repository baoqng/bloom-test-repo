// bloom-deps:

export function buildExponentialBackoff(attempt: number, baseMs: number, maxMs: number): number {
  // Step 1: Type validation
  if (typeof attempt !== 'number' || !Number.isFinite(attempt)) {
    throw new TypeError('attempt must be a finite number');
  }
  if (typeof baseMs !== 'number' || !Number.isFinite(baseMs)) {
    throw new TypeError('baseMs must be a finite number');
  }
  if (typeof maxMs !== 'number' || !Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }

  // Step 2: Range validation
  if (attempt < 0 || !Number.isInteger(attempt)) {
    throw new RangeError('attempt must be a non-negative integer');
  }
  if (!Number.isInteger(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive integer');
  }
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be greater than or equal to baseMs');
  }

  // Step 3: Compute clamped exponential backoff
  const raw = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  return Math.floor(raw);
}