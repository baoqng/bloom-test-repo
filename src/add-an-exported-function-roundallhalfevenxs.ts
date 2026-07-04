// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const element of xs) {
    if (!Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values using banker's rounding
  return xs.map((num) => {
    const floor = Math.floor(num);
    const fraction = num - floor;

    // If fraction is less than 0.5, round down
    if (fraction < 0.5) {
      return floor;
    }

    // If fraction is greater than 0.5, round up
    if (fraction > 0.5) {
      return floor + 1;
    }

    // If fraction equals exactly 0.5, round to the nearest even number
    // If floor is even, stay at floor; if floor is odd, go to floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  });
}