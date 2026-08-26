// bloom-deps:

function validateCronField(field: unknown, fieldName: unknown, min: unknown, max: unknown): string {
  if (typeof field !== 'string') {
    throw new TypeError('field must be a string');
  }

  if (typeof fieldName !== 'string' || fieldName.trim().length === 0) {
    throw new TypeError('fieldName must be a non-empty string');
  }

  if (
    typeof min !== 'number' ||
    !Number.isFinite(min) ||
    !Number.isInteger(min) ||
    min < 0
  ) {
    throw new TypeError('min must be a non-negative integer');
  }

  if (
    typeof max !== 'number' ||
    !Number.isFinite(max) ||
    !Number.isInteger(max) ||
    max <= 0
  ) {
    throw new TypeError('max must be a positive integer');
  }

  if (max <= min) {
    throw new RangeError('max must be greater than min');
  }

  const trimmed = field.trim();

  if (trimmed.length === 0) {
    throw new RangeError('field must not be empty');
  }

  if (trimmed === '*') {
    return '*';
  }

  const stepMatch = trimmed.match(/^\*\/(\d+)$/);
  if (stepMatch) {
    const N = parseInt(stepMatch[1], 10);
    if (N < 1 || N > max) {
      throw new RangeError(`step value must be between 1 and ${max}`);
    }
    return trimmed;
  }

  const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const A = parseInt(rangeMatch[1], 10);
    const B = parseInt(rangeMatch[2], 10);
    if (A < min || A > max) {
      throw new RangeError(`range start must be between ${min} and ${max}`);
    }
    if (B < min || B > max) {
      throw new RangeError(`range end must be between ${min} and ${max}`);
    }
    if (A > B) {
      throw new RangeError('range start must be less than or equal to range end');
    }
    return trimmed;
  }

  const literalMatch = trimmed.match(/^\d+$/);
  if (literalMatch) {
    const val = parseInt(trimmed, 10);
    if (val < min || val > max) {
      throw new RangeError(`value must be between ${min} and ${max}`);
    }
    return trimmed;
  }

  throw new RangeError('invalid cron field format');
}

export { validateCronField };