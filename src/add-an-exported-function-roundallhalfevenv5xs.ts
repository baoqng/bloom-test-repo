// bloom-deps:

export function roundAllHalfEvenV5(xs: number[]): number[] {
  // Validate all elements are finite before processing
  for (const x of xs) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((x) => {
    // Extract integer and fractional parts
    const integer = Math.trunc(x);
    const fract = x - integer;

    // Not a tie: round to nearest
    if (fract !== 0.5 && fract !== -0.5) {
      return Math.round(x);
    }

    // Tie case: round half to even
    // For positive x: if integer is even, round down; if odd, round up
    // For negative x: same logic applies to the integer part
    if (integer % 2 === 0) {
      return integer;
    } else {
      return integer + (fract > 0 ? 1 : -1);
    }
  });
}