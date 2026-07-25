// bloom-deps:

export function roundAllHalfEvenV2(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create new array to avoid mutating input
  const result: number[] = [];

  for (const x of xs) {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // Check for exact tie (0.5)
    if (fract === 0.5) {
      // Round to nearest even integer (banker's rounding)
      // If floor is even, round down (keep floor)
      // If floor is odd, round up (use floor + 1)
      result.push(floor % 2 === 0 ? floor : floor + 1);
    } else if (fract === -0.5) {
      // For negative numbers: if floor is even, use floor; if odd, use floor - 1
      result.push(floor % 2 === 0 ? floor : floor - 1);
    } else {
      // Not a tie; use standard rounding (nearest)
      result.push(Math.round(x));
    }
  }

  return result;
}