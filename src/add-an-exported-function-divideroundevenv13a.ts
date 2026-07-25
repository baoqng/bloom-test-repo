// bloom-deps:

export function divideRoundEvenV13(a: number, b: number): number {
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

  // Compute the division
  const quotient = a / b;

  // Extract integer and fractional parts
  const integer = Math.floor(quotient);
  const fractional = quotient - integer;

  // Check for exact tie (0.5)
  if (fractional === 0.5) {
    // Banker's rounding: round to nearest even integer
    // If integer is even, round down (return integer)
    // If integer is odd, round up (return integer + 1)
    return integer % 2 === 0 ? integer : integer + 1;
  }

  // For negative numbers, handle the fractional part correctly
  if (fractional === -0.5) {
    // For negative ties, same banker's rounding logic
    // integer is already floored, so we need to check if it's even
    return integer % 2 === 0 ? integer : integer - 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(quotient);
}