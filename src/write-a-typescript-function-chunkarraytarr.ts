// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  // Validate that arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  // Validate that size is a finite number
  if (typeof size !== 'number' || !isFinite(size)) {
    throw new TypeError('size must be a finite number');
  }

  // Validate that size is a positive integer
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('size must be a positive integer');
  }

  // Return empty array if arr is empty
  if (arr.length === 0) {
    return [];
  }

  // Chunk the array without mutating the input
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

export { chunkArray, ServiceError };