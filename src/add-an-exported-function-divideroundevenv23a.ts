// bloom-deps:

export function divideRoundEvenV23(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Check for division by zero
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform the division
  const quotient = a / b;

  // Get the integer and fractional parts
  const integerPart = Math.floor(quotient);
  const fractionalPart = quotient - integerPart;

  // Handle negative numbers correctly
  if (quotient < 0 && fractionalPart !== 0) {
    // For negative quotients, adjust the integer part
    const absQuotient = Math.abs(quotient);
    const absIntegerPart = Math.floor(absQuotient);
    const absFractionalPart = absQuotient - absIntegerPart;

    // Check for exact tie (0.5)
    if (absFractionalPart === 0.5) {
      // Banker's rounding: round to nearest even
      const roundedAbs = absIntegerPart % 2 === 0 ? absIntegerPart : absIntegerPart + 1;
      return -roundedAbs;
    } else if (absFractionalPart < 0.5) {
      return -absIntegerPart;
    } else {
      return -(absIntegerPart + 1);
    }
  }

  // Check for exact tie (0.5)
  if (fractionalPart === 0.5) {
    // Banker's rounding: round to nearest even
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }

  // Round to nearest integer (standard rounding)
  if (fractionalPart < 0.5) {
    return integerPart;
  } else {
    return integerPart + 1;
  }
}