// bloom-deps:

export function roundAllHalfEvenV22(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values
  const result: number[] = [];

  for (const x of xs) {
    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    if (fract === 0.5) {
      // Exact tie: round to nearest even integer
      // If floor is even, round down (return floor)
      // If floor is odd, round up (return floor + 1)
      rounded = floor % 2 === 0 ? floor : floor + 1;
    } else if (fract === -0.5) {
      // Exact tie for negative: round to nearest even integer
      // floor is already one less than the actual integer part
      // For x = -0.5, floor = -1, and -1 is odd, so we round to 0 (even)
      // For x = -1.5, floor = -2, and -2 is even, so we round to -2
      rounded = floor % 2 === 0 ? floor : floor + 1;
    } else {
      // Not a tie: use standard rounding (nearest)
      rounded = Math.round(x);
    }

    result.push(rounded);
  }

  return result;
}