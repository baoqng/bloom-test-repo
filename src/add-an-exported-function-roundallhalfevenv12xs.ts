// bloom-deps:

export function roundAllHalfEvenV12(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value using banker's rounding (half-to-even)
  return xs.map((x) => {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // Handle exact tie case (fract === 0.5 or fract === -0.5)
    // For positive numbers: if fract === 0.5, round to nearest even
    // For negative numbers: if fract === -0.5, round to nearest even
    if (fract === 0.5) {
      // Round to nearest even integer
      // If floor is even, return floor; if odd, return floor + 1
      return floor % 2 === 0 ? floor : floor + 1;
    } else if (fract === -0.5) {
      // For negative: floor is already the lower integer
      // Round to nearest even
      // If floor is even, return floor; if odd, return floor - 1
      return floor % 2 === 0 ? floor : floor - 1;
    } else {
      // Not a tie: use standard rounding (round to nearest)
      return Math.round(x);
    }
  });
}