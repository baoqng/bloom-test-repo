// bloom-deps:

export function divideRoundEvenV7(a: number, b: number): number {
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

  // Perform the division
  const quotient = a / b;

  // Get the integer part and fractional part
  const intPart = Math.trunc(quotient);
  const fract = quotient - intPart;

  // Check if it's an exact tie (fractional part is exactly 0.5)
  if (fract === 0.5) {
    // Round to nearest even integer
    return intPart % 2 === 0 ? intPart : intPart + 1;
  } else if (fract === -0.5) {
    // For negative ties, round to nearest even integer
    return intPart % 2 === 0 ? intPart : intPart - 1;
  }

  // For non-tie values, use standard rounding (round to nearest)
  return Math.round(quotient);
}