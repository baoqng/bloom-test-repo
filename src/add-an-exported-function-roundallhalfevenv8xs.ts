// bloom-deps:

export function roundAllHalfEvenV8(xs: number[]): number[] {
  // Validate input array
  if (!Array.isArray(xs)) {
    throw new RangeError('all elements must be finite');
  }

  // Validate all elements are finite
  for (const element of xs) {
    if (!Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value using banker's rounding (half-to-even)
  const result: number[] = xs.map((num) => {
    const floor = Math.floor(num);
    const fract = num - floor;

    // Handle exact tie case (0.5)
    if (fract === 0.5) {
      // Round to even: if floor is even, return floor; if odd, return floor + 1
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For non-tie cases, use standard rounding (nearest integer)
    if (fract >= 0.5) {
      return floor + 1;
    } else {
      return floor;
    }
  });

  return result;
}