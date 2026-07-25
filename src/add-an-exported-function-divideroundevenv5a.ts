// bloom-deps:

export function divideRoundEvenV5(a: number, b: number): number {
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
  const result = a / b;

  // If the result is already an integer, return it
  if (Number.isInteger(result)) {
    return result;
  }

  // Get the integer part and fractional part
  const floor = Math.floor(result);
  const fract = result - floor;

  // Check for exact tie (fract === 0.5)
  // Using strict equality as per the contract (tie_epsilon = strict)
  if (fract === 0.5) {
    // Round to nearest even: if floor is even, return floor; otherwise return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For non-tie fractions, use standard nearest rounding
  // If fract < 0.5, round down (return floor)
  // If fract > 0.5, round up (return floor + 1)
  return fract < 0.5 ? floor : floor + 1;
}