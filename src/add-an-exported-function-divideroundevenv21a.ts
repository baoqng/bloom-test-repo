// bloom-deps:

export function divideRoundEvenV21(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const result = a / b;

  // Get the integer part and fractional part
  const integerPart = Math.floor(result);
  const fractionalPart = result - integerPart;

  // Handle exact tie case (x.5): round to nearest even
  if (fractionalPart === 0.5) {
    // If the integer part is even, round down (return it as is)
    // If the integer part is odd, round up (add 1)
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }

  // Handle negative numbers with exact tie case
  if (fractionalPart === -0.5 || (result < 0 && Math.abs(fractionalPart - (-0.5)) < 1e-15)) {
    // For negative ties, we need to consider the integer part after floor
    const absIntegerPart = Math.abs(integerPart);
    if (absIntegerPart % 2 === 0) {
      return integerPart;
    } else {
      return integerPart - 1;
    }
  }

  // For all other cases, use standard rounding (nearest integer)
  return Math.round(result);
}