export function validateNonNegativeDecimal(value: unknown, maxDecimalPlaces: unknown): number {
  // Step 1: Type check for value
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }

  // Step 2: Finiteness check for value
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be finite');
  }

  // Step 3: Non-negative check for value
  if (value < 0) {
    throw new RangeError('value must be non-negative');
  }

  // Step 4: Validate maxDecimalPlaces type and constraints
  if (
    typeof maxDecimalPlaces !== 'number' ||
    !Number.isFinite(maxDecimalPlaces) ||
    !Number.isInteger(maxDecimalPlaces) ||
    maxDecimalPlaces < 0
  ) {
    throw new TypeError('maxDecimalPlaces must be a non-negative integer');
  }

  // Step 5: Check maxDecimalPlaces upper bound
  if (maxDecimalPlaces > 10) {
    throw new RangeError('maxDecimalPlaces must not exceed 10');
  }

  // Step 6: Count actual decimal places in value
  const valueStr = String(value);
  const dotIndex = valueStr.indexOf('.');
  const actualDecimalPlaces = dotIndex === -1 ? 0 : valueStr.length - dotIndex - 1;

  // Step 7: Validate decimal places don't exceed maximum
  if (actualDecimalPlaces > maxDecimalPlaces) {
    throw new RangeError(
      `value has too many decimal places (max ${maxDecimalPlaces})`
    );
  }

  // Step 8: Return the validated value
  return value;
}