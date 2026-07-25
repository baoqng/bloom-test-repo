// bloom-deps:

export function divideRoundEvenV4(a: number, b: number): number {
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
  const integer = Math.trunc(quotient);
  const fractional = quotient - integer;
  
  // Check for exact tie (fractional part === 0.5 or === -0.5)
  // Using strict equality as per the contract (tie_epsilon = strict)
  if (fractional === 0.5) {
    // Round to nearest even integer (banker's rounding)
    // If integer is even, round down (keep integer); if odd, round up
    return integer % 2 === 0 ? integer : integer + 1;
  } else if (fractional === -0.5) {
    // For negative ties, round to nearest even integer
    // If integer is even, round down (keep integer); if odd, round up (toward zero)
    return integer % 2 === 0 ? integer : integer - 1;
  } else {
    // Non-tie cases: use standard rounding (nearest integer)
    return Math.round(quotient);
  }
}