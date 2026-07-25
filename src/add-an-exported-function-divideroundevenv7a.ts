// bloom-deps:

export function divideRoundEvenV7(a: number, b: number): number {
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
  const result = a / b;

  // If result is already an integer, return it
  if (Number.isInteger(result)) {
    return result;
  }

  // Get the integer part and fractional part
  const floor = Math.floor(result);
  const fract = result - floor;

  // Check for exact tie (fract === 0.5)
  if (fract === 0.5) {
    // Round to nearest even integer
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For non-tie cases, use standard nearest rounding
  // If fract < 0.5, round down
  // If fract > 0.5, round up
  return fract < 0.5 ? floor : floor + 1;
}