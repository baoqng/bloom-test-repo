// bloom-deps:

export function roundAllHalfEvenV9(xs: number[]): number[] {
  // Validate input: check that all elements are finite
  for (let i = 0; i < xs.length; i++) {
    if (!Number.isFinite(xs[i])) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values
  const result: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const num = xs[i];
    const floor = Math.floor(num);
    const fract = num - floor;

    // Determine the rounded value using banker's rounding (half-to-even)
    if (fract < 0.5) {
      // Round down
      result.push(floor);
    } else if (fract > 0.5) {
      // Round up
      result.push(floor + 1);
    } else {
      // fract === 0.5: tie case - round to nearest even
      // If floor is even, round down; if odd, round up
      if (floor % 2 === 0) {
        result.push(floor);
      } else {
        result.push(floor + 1);
      }
    }
  }

  return result;
}