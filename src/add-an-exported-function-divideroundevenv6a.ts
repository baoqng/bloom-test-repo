// bloom-deps:

export function divideRoundEvenV6(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }

  // Check for division by zero
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const result = a / b;

  // Get the integer part and fractional part
  const integerPart = Math.trunc(result);
  const fractionalPart = result - integerPart;

  // Check for exact tie (fractional part === 0.5 or -0.5)
  if (fractionalPart === 0.5) {
    // Round to nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  } else if (fractionalPart === -0.5) {
    // For negative ties, round to nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart - 1;
  }

  // For non-tie cases, use standard rounding (Math.round)
  return Math.round(result);
}