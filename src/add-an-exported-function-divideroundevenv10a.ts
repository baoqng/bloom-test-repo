// bloom-deps:

export function divideRoundEvenV10(a: number, b: number): number {
  // [REQUIRED] Validate all request - type guard for non-numeric inputs
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEvenV10: both arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('divideRoundEvenV10: arguments must be valid numbers (not NaN)');
  }

  // [REQUIRED] Handle division by zero explicitly
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform the division
  const quotient = a / b;

  // Extract the integer and fractional parts
  const integer = Math.floor(quotient);
  const fractional = quotient - integer;

  // Check for exact tie (halfway point)
  // Using strict equality as per pinned contract: tie_epsilon = "strict"
  if (fractional === 0.5) {
    // Banker's rounding (round to nearest even)
    // If integer is even, round down (return integer)
    // If integer is odd, round up (return integer + 1)
    return integer % 2 === 0 ? integer : integer + 1;
  }

  // For all other cases, use standard rounding (nearest integer)
  return Math.round(quotient);
}