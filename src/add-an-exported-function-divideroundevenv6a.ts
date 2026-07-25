// bloom-deps:

export function divideRoundEvenV6(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const quotient = a / b;

  // Get the integer part and fractional part
  const integerPart = Math.trunc(quotient);
  const fractionalPart = quotient - integerPart;

  // Handle exact halves (0.5 or -0.5) with banker's rounding (round to even)
  if (fractionalPart === 0.5) {
    // Round to the nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }

  if (fractionalPart === -0.5) {
    // For negative halves, round to nearest even
    return integerPart % 2 === 0 ? integerPart : integerPart - 1;
  }

  // For all other cases, round to nearest integer using Math.round
  return Math.round(quotient);
}