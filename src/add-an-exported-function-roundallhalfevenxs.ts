// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  // Validate input: check that all elements are finite numbers
  for (const element of xs) {
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element using round-half-to-even
  return xs.map((num) => {
    const floor = Math.floor(num);
    const fract = num - floor;

    // If fractional part is exactly 0.5, apply half-even rule
    if (fract === 0.5) {
      // Round to nearest even integer
      // If floor is even, round down (return floor)
      // If floor is odd, round up (return floor + 1)
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers with fract === 0.5
    if (fract === -0.5) {
      // floor is already one less than the integer
      // We need to round to nearest even
      const roundedUp = floor + 1;
      return roundedUp % 2 === 0 ? roundedUp : floor;
    }

    // For all other cases, use standard rounding (nearest integer)
    return Math.round(num);
  });
}