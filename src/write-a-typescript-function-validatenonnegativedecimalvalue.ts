// bloom-deps:

function validateNonNegativeDecimal(value: unknown, maxDecimalPlaces: unknown): number {
  // Validate value type and NaN
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }

  // Validate value is finite
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be finite');
  }

  // Validate value is non-negative
  if (value < 0) {
    throw new RangeError('value must be non-negative');
  }

  // Validate maxDecimalPlaces type and constraints
  if (
    typeof maxDecimalPlaces !== 'number' ||
    Number.isNaN(maxDecimalPlaces) ||
    !Number.isFinite(maxDecimalPlaces) ||
    !Number.isInteger(maxDecimalPlaces) ||
    maxDecimalPlaces < 0
  ) {
    throw new TypeError('maxDecimalPlaces must be a non-negative integer');
  }

  // Validate maxDecimalPlaces does not exceed 10
  if (maxDecimalPlaces > 10) {
    throw new RangeError('maxDecimalPlaces must not exceed 10');
  }

  // Count actual decimal places
  const str = String(value);
  const dotIndex = str.indexOf('.');
  const actualDecimalPlaces = dotIndex === -1 ? 0 : str.length - dotIndex - 1;

  // Validate decimal places do not exceed maxDecimalPlaces
  if (actualDecimalPlaces > maxDecimalPlaces) {
    throw new RangeError(`value has too many decimal places (max ${maxDecimalPlaces})`);
  }

  return value;
}

export { validateNonNegativeDecimal };