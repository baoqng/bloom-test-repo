// bloom-deps:

function validateChunkSize(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('chunkSize must be a finite number');
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError('chunkSize must be a positive integer');
  }

  return value;
}

export { validateChunkSize };