// bloom-deps:

export function divideRoundEvenV3(a: number, b: number): number {
  // Type validation - must fire BEFORE any arithmetic
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

  // Get the integer and fractional parts
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // For exact ties (fract === 0.5), apply banker's rounding (round to nearest even)
  if (fract === 0.5) {
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact ties, handle the negative side
  if (fract === -0.5) {
    // floor is one less than the ceiling for negative decimals
    const ceil = floor + 1;
    // If ceil is even, round to ceil
    // If ceil is odd, round to floor
    return ceil % 2 === 0 ? ceil : floor;
  }

  // For all other cases (not exact ties), use standard rounding
  // Round to nearest integer
  return Math.round(quotient);
}