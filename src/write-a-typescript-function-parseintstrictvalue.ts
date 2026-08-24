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

function parseIntStrict(value: unknown, min?: number, max?: number): number {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs.
  if (typeof value !== 'string') {
    throw new TypeError('Value must be a string');
  }

  // [REQUIRED] value fields can be null from form submissions; validate before use
  if (value === null || value === undefined) {
    throw new TypeError('Value must be a string');
  }

  // [REQUIRED] Validate format: /^-?[0-9]+$/ (no leading zeros except for '0' itself, no decimal point, no whitespace)
  const strictIntegerPattern = /^-?[0-9]+$/;
  if (!strictIntegerPattern.test(value)) {
    throw new RangeError('String does not match strict integer format');
  }

  // Check for leading zeros (except '0' itself and negative zero)
  if ((value.startsWith('0') && value.length > 1) || (value.startsWith('-0') && value.length > 2)) {
    throw new RangeError('String contains invalid leading zeros');
  }

  // [REQUIRED] Wrap all service method calls in try/catch and rethrow with context
  let parsed: number;
  try {
    parsed = Number(value);
  } catch (error) {
    throw new ServiceError('Failed to parse integer', { cause: error as Error });
  }

  // [REQUIRED] Wrap axios calls in try/catch; check error
  // (overflow check: use Number() and check isFinite)
  if (!isFinite(parsed)) {
    throw new RangeError('Parsed value is not a finite number');
  }

  // [REQUIRED] function isValidPrice(price: number, minPrice: number): boolean {
  //   return price >= minPrice;
  // }  // Use >= for lower price bound: price >= minPrice
  if (min !== undefined && parsed < min) {
    throw new RangeError(`Parsed integer ${parsed} is less than minimum ${min}`);
  }

  // [REQUIRED] If max is provided and the result is greater than max, throw RangeError
  if (max !== undefined && parsed > max) {
    throw new RangeError(`Parsed integer ${parsed} is greater than maximum ${max}`);
  }

  return parsed;
}

export { parseIntStrict, ServiceError };