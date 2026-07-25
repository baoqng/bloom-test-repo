// bloom-deps:

export function roundHalfEvenV2(x: number): number {
  // Type guard: reject non-numeric inputs before any arithmetic
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle zero and integers
  if (x === 0 || Number.isInteger(x)) {
    return x;
  }

  // Extract the integer and fractional parts
  const integer = Math.trunc(x);
  const fract = x - integer;

  // Exact half case: apply banker's rounding (round to nearest even)
  if (fract === 0.5) {
    // Round up to the next integer if it's even, otherwise stay at current
    return integer % 2 === 0 ? integer : integer + 1;
  }

  // Exact negative half case: apply banker's rounding
  if (fract === -0.5) {
    // Round down (toward zero) to the next even integer
    return integer % 2 === 0 ? integer : integer - 1;
  }

  // Non-half case: round to nearest (standard rounding)
  return Math.round(x);
}