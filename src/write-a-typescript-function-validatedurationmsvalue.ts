// bloom-deps:

function validateDurationMs(value: unknown, minMs: unknown, maxMs: unknown): number {
  if (typeof value !== 'number') {
    throw new TypeError('value must be a number');
  }
  if (typeof minMs !== 'number') {
    throw new TypeError('minMs must be a number');
  }
  if (typeof maxMs !== 'number') {
    throw new TypeError('maxMs must be a number');
  }

  if (!isFinite(value) || !isFinite(minMs) || !isFinite(maxMs)) {
    throw new TypeError('All arguments must be finite');
  }

  if (value < 0 || !Number.isInteger(value)) {
    throw new RangeError('value must be a non-negative integer');
  }
  if (minMs < 0 || !Number.isInteger(minMs)) {
    throw new RangeError('minMs must be a non-negative integer');
  }
  if (!Number.isInteger(maxMs) || maxMs <= 0) {
    throw new RangeError('maxMs must be a positive integer');
  }

  if (minMs > maxMs) {
    throw new RangeError('minMs must not exceed maxMs');
  }

  if (value < minMs) {
    throw new RangeError(`Duration ${value}ms is below minimum ${minMs}ms`);
  }
  if (value > maxMs) {
    throw new RangeError(`Duration ${value}ms exceeds maximum ${maxMs}ms`);
  }

  return value;
}

export { validateDurationMs };