// bloom-deps:

export function roundHalfEvenV6(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer part and fractional part
  const integer = Math.floor(x);
  const fract = x - integer;

  // Check for exact tie (0.5)
  if (fract === 0.5) {
    // Round to nearest even: if integer is even, round down; if odd, round up
    return integer % 2 === 0 ? integer : integer + 1;
  }

  // For negative numbers with exact tie
  if (fract === -0.5) {
    // For negatives: floor gives us the lower integer
    // e.g., -2.5: floor(-2.5) = -3, so we need to check -3
    const lowerInt = Math.floor(x);
    const upperInt = lowerInt + 1;
    // Round to nearest even
    return Math.abs(lowerInt) % 2 === 0 ? lowerInt : upperInt;
  }

  // For non-tie cases, use standard rounding (round to nearest)
  return Math.round(x);
}