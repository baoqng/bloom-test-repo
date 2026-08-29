// bloom-deps:

function validateNonNegativeDecimal(input: unknown, maxDecimalPlaces: unknown): number {
  // Validate input is a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Validate maxDecimalPlaces is a non-negative integer
  if (
    typeof maxDecimalPlaces !== 'number' ||
    !Number.isFinite(maxDecimalPlaces) ||
    !Number.isInteger(maxDecimalPlaces) ||
    maxDecimalPlaces < 0
  ) {
    throw new TypeError('maxDecimalPlaces must be a non-negative integer');
  }

  // Validate the decimal format using a regex
  // Rules:
  // - digits with optional single dot
  // - no leading zeros except '0.x'
  // - no trailing dot
  // - no negative sign (we check separately for negative)
  // Valid patterns: '0', '0.5', '123', '123.456', '0.0'
  // Invalid: '01', '1.', '.5', '1.2.3', 'abc', '-1'
  const validDecimalRegex = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

  // Check for negative sign first (to distinguish SyntaxError vs RangeError)
  // If it starts with '-', it's syntactically a negative number
  if (input.startsWith('-')) {
    // Check if the rest is a valid decimal - if so, it's a negative value (RangeError)
    // otherwise it's a syntax error
    const withoutMinus = input.slice(1);
    if (validDecimalRegex.test(withoutMinus)) {
      throw new RangeError('Value must be non-negative');
    } else {
      throw new SyntaxError('Not a valid decimal number');
    }
  }

  if (!validDecimalRegex.test(input)) {
    throw new SyntaxError('Not a valid decimal number');
  }

  // Count decimal places using indexOf+slice (not split)
  const dotIndex = input.indexOf('.');
  if (dotIndex !== -1) {
    const decimalPart = input.slice(dotIndex + 1);
    if (decimalPart.length > maxDecimalPlaces) {
      throw new RangeError('Too many decimal places');
    }
  }

  const parsed = Number(input);

  // Sanity check: parsed should be non-negative at this point
  if (parsed < 0) {
    throw new RangeError('Value must be non-negative');
  }

  return parsed;
}

export { validateNonNegativeDecimal };