// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public context?: { cause?: Error }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function validateNumericRange(
  value: unknown,
  min: unknown,
  max: unknown,
  label: unknown
): number {
  // Validate label is a non-empty string
  if (typeof label !== 'string' || label.length === 0) {
    throw new TypeError('label must be a non-empty string');
  }

  // Validate value is a number
  if (typeof value !== 'number') {
    throw new TypeError(`${label} must be of type 'number'`);
  }

  // Validate value is not NaN
  if (Number.isNaN(value)) {
    throw new TypeError(`${label} cannot be NaN`);
  }

  // Validate value is finite (not Infinity or -Infinity)
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be finite`);
  }

  // Validate min is a finite number
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }

  // Validate max is a finite number
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }

  // Validate min is not greater than max
  if (min > max) {
    throw new RangeError('min must not be greater than max');
  }

  // Validate value is within [min, max] inclusive
  if (value < min || value > max) {
    throw new RangeError(`${label} must be between ${min} and ${max}`);
  }

  return value;
}