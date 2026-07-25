// bloom-deps:

export function roundAllHalfEvenV13(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    // Check if the element is finite
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    // Extract the integer and fractional parts
    const floor = Math.floor(x);
    const fract = x - floor;

    // Determine the rounded value using banker's rounding (round-half-to-even)
    let rounded: number;

    if (fract < 0.5) {
      // Round down
      rounded = floor;
    } else if (fract > 0.5) {
      // Round up
      rounded = floor + 1;
    } else {
      // Exact tie at 0.5: round to nearest even
      if (floor % 2 === 0) {
        // floor is even, round down
        rounded = floor;
      } else {
        // floor is odd, round up
        rounded = floor + 1;
      }
    }

    result.push(rounded);
  }

  return result;
}