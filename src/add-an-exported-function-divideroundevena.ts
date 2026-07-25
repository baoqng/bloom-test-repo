// bloom-deps:

export function divideRoundEven(a: number, b: number): number {
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
  const quotient = a / b;

  // Get the integer part and fractional part
  const intPart = Math.trunc(quotient);
  const fract = quotient - intPart;

  // Check for exact tie (fract === 0.5 or fract === -0.5)
  if (fract === 0.5) {
    // Round to nearest even integer (round half to even)
    // If intPart is even, round down; if odd, round up
    return intPart % 2 === 0 ? intPart : intPart + 1;
  } else if (fract === -0.5) {
    // For negative halfway cases: -2.5 should round to -2 (even), -3.5 should round to -4 (even)
    // intPart is the truncated integer (towards zero)
    // For -2.5: intPart = -2 (even), so stay at -2
    // For -3.5: intPart = -3 (odd), so go to -4
    return intPart % 2 === 0 ? intPart : intPart - 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(quotient);
}