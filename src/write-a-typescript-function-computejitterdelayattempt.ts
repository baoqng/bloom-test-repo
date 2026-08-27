// bloom-deps:
function computeJitterDelay(attempt: unknown, baseMs: unknown, maxMs: unknown): number {
  if (typeof attempt !== 'number') {
    throw new TypeError('attempt must be a number');
  }
  if (typeof baseMs !== 'number') {
    throw new TypeError('baseMs must be a number');
  }
  if (typeof maxMs !== 'number') {
    throw new TypeError('maxMs must be a number');
  }

  if (!Number.isFinite(attempt) || !Number.isInteger(attempt) || attempt < 0) {
    throw new RangeError('attempt must be a non-negative integer');
  }
  if (!Number.isFinite(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive finite number');
  }
  if (!Number.isFinite(maxMs) || maxMs <= 0) {
    throw new RangeError('maxMs must be a positive finite number');
  }
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be greater than or equal to baseMs');
  }

  const cap = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return Math.random() * cap;
}

export { computeJitterDelay };