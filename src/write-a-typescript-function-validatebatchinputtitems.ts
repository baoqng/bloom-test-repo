// bloom-deps:

export function validateBatchInput<T>(items: unknown, batchSize: unknown): { items: T[]; batchSize: number } {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (items.length === 0) {
    throw new RangeError('items must not be empty');
  }

  if (typeof batchSize !== 'number' || !isFinite(batchSize) || batchSize <= 0 || batchSize !== Math.floor(batchSize)) {
    throw new TypeError('batchSize must be a positive integer');
  }

  if (batchSize > items.length) {
    throw new RangeError('batchSize exceeds items length');
  }

  return { items: items as T[], batchSize };
}