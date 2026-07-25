// bloom-deps:

export function divideRoundEvenV24(a: number, b: number): number {
  // Input validation - must happen BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Check for division by zero
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const quotient = a / b;

  // Get the integer part and fractional part
  const integerPart = Math.trunc(quotient);
  const fractionalPart = quotient - integerPart;

  // Handle exact ties (0.5 or -0.5) with banker's rounding (round to even)
  if (fractionalPart === 0.5) {
    // Round to the nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }

  if (fractionalPart === -0.5) {
    // Round to the nearest even integer (for negative)
    return integerPart % 2 === 0 ? integerPart : integerPart - 1;
  }

  // For non-tie values, round to nearest integer using standard rounding
  return Math.round(quotient);
}