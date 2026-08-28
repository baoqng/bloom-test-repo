// bloom-deps:

export function computeRetryDelay(attempt: unknown, baseMs: unknown, maxMs: unknown): number {
  if (
    typeof attempt !== 'number' ||
    !Number.isFinite(attempt) ||
    !Number.isInteger(attempt) ||
    attempt < 1
  ) {
    throw new TypeError('attempt must be a positive finite integer');
  }

  if (
    typeof baseMs !== 'number' ||
    !Number.isFinite(baseMs) ||
    baseMs <= 0
  ) {
    throw new TypeError('baseMs must be a positive finite number');
  }

  if (
    typeof maxMs !== 'number' ||
    !Number.isFinite(maxMs) ||
    maxMs <= 0
  ) {
    throw new TypeError('maxMs must be a positive finite number');
  }

  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be >= baseMs');
  }

  const cap = Math.min(maxMs, baseMs * Math.pow(2, attempt - 1));
  return Math.random() * cap;
}