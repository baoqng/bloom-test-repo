// bloom-deps:

export function roundAllHalfEvenV24(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    // Validate that element is finite
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    // Extract the integer and fractional parts
    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    // Check for exact tie (0.5)
    if (fract === 0.5) {
      // Round to nearest even (banker's rounding)
      // If floor is even, round down; if odd, round up
      rounded = floor % 2 === 0 ? floor : floor + 1;
    } else if (fract > 0.5) {
      // Round up
      rounded = floor + 1;
    } else {
      // fract < 0.5, round down
      rounded = floor;
    }

    result.push(rounded);
  }

  return result;
}