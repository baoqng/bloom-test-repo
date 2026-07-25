// bloom-deps:

export function divideRoundEvenV4(a: number, b: number): number {
  // Type validation guard - must run BEFORE any arithmetic
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
  const result = a / b;

  // If result is already an integer, return it
  if (Number.isInteger(result)) {
    return result;
  }

  // Extract the fractional part
  const floor = Math.floor(result);
  const fract = result - floor;

  // Check for exact tie (banker's rounding)
  if (fract === 0.5) {
    // Round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Standard nearest rounding for non-half fractions
  return Math.round(result);
}