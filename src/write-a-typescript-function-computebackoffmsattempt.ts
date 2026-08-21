// bloom-deps:

function computeBackoffMs(attempt: number, baseMs: number, maxMs: number): number {
  if (!Number.isInteger(attempt) || !isFinite(attempt) || attempt < 0) {
    throw new RangeError('attempt must be a non-negative integer');
  }

  if (typeof baseMs !== 'number' || !isFinite(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive finite number');
  }

  if (typeof maxMs !== 'number' || !isFinite(maxMs) || maxMs <= 0) {
    throw new RangeError('maxMs must be a positive finite number');
  }

  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be >= baseMs');
  }

  return Math.min(baseMs * 2 ** attempt, maxMs);
}

export { computeBackoffMs };