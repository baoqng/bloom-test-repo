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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

function clampToRange(value: unknown, min: unknown, max: unknown): number {
  // Validate all inputs are finite numbers
  if (!isFiniteNumber(value)) {
    throw new TypeError('value must be a finite number');
  }
  if (!isFiniteNumber(min)) {
    throw new TypeError('min must be a finite number');
  }
  if (!isFiniteNumber(max)) {
    throw new TypeError('max must be a finite number');
  }

  // Check that min <= max
  if (min > max) {
    throw new RangeError('min must be less than or equal to max');
  }

  // Clamp value to [min, max] inclusive
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export { clampToRange, ServiceError };