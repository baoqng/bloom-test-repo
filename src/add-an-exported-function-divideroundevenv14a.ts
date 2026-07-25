// bloom-deps:

export function divideRoundEvenV14(a: number, b: number): number {
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

  // Perform the division
  const result = a / b;

  // Get the integer part and fractional part
  const integer = Math.trunc(result);
  const fractional = result - integer;

  // Check for exact tie (0.5)
  if (fractional === 0.5) {
    // Banker's rounding: round to nearest even
    return integer % 2 === 0 ? integer : integer + 1;
  }

  if (fractional === -0.5) {
    // Banker's rounding for negative: round to nearest even
    return integer % 2 === 0 ? integer : integer - 1;
  }

  // For all other cases, use standard rounding to nearest
  return Math.round(result);
}