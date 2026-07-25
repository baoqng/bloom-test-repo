// bloom-deps:

export function roundHalfEvenV2(x: number): number {
  // Type validation guard: must be numeric and finite
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer part and fractional part
  const integer = Math.floor(x);
  const fract = x - integer;

  // Not a tie: use standard rounding (nearest integer)
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Exact tie (x.5 or x.-5): round to nearest even integer
  // For positive: if integer is even, round down; if odd, round up
  // For negative: same logic applies to the floor value
  if (fract === 0.5) {
    // Positive tie: integer is floor(x), check if even
    return integer % 2 === 0 ? integer : integer + 1;
  } else {
    // Negative tie (fract === -0.5): integer is floor(x) which is one less than the true integer
    // We need to check the actual integer value (which would be integer + 1 after rounding down the magnitude)
    const actualInteger = integer + 1;
    return actualInteger % 2 === 0 ? actualInteger : integer;
  }
}