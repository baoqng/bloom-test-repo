// bloom-deps:

function validateSignedInteger(value: unknown, min: unknown, max: unknown): number {
  // Step 1: type check value
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  // Step 2: empty/whitespace check
  if (!value.trim()) {
    throw new RangeError('value must not be empty');
  }

  // Step 3: validate min
  if (
    typeof min !== 'number' ||
    !Number.isFinite(min) ||
    !Number.isInteger(min) ||
    min < Number.MIN_SAFE_INTEGER ||
    min > Number.MAX_SAFE_INTEGER
  ) {
    throw new TypeError('min must be a safe integer');
  }

  // Step 4: validate max
  if (
    typeof max !== 'number' ||
    !Number.isFinite(max) ||
    !Number.isInteger(max) ||
    max < Number.MIN_SAFE_INTEGER ||
    max > Number.MAX_SAFE_INTEGER
  ) {
    throw new TypeError('max must be a safe integer');
  }

  // Step 5: max >= min
  if (max < min) {
    throw new RangeError('max must be >= min');
  }

  // Step 6: trim and pattern check
  const trimmed = value.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    throw new RangeError('value must be an integer (optional leading minus, then digits only)');
  }

  // Step 7: leading zeros check
  if (trimmed.length > 1) {
    if (trimmed.startsWith('-0') || trimmed.startsWith('0')) {
      throw new RangeError('value must not have leading zeros');
    }
  }

  // Step 8: parse and range check
  const parsed = parseInt(trimmed, 10);
  if (parsed < min || parsed > max) {
    throw new RangeError(`value must be between ${min} and ${max}`);
  }

  return parsed;
}

export { validateSignedInteger };