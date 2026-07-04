export function roundAllHalfEven(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const element of xs) {
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values using banker's rounding
  return xs.map((x) => {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    const fraction = x - floor;

    // If exact integer, return it
    if (fraction === 0) {
      return x;
    }

    // If fraction < 0.5, round down (toward floor)
    if (fraction < 0.5) {
      // Avoid returning -0 by converting to +0
      return floor === 0 ? 0 : floor;
    }

    // If fraction > 0.5, round up (toward ceil)
    if (fraction > 0.5) {
      return ceil === 0 ? 0 : ceil;
    }

    // If fraction === 0.5, round to nearest even number
    // If floor is even, round down; if floor is odd, round up
    const result = floor % 2 === 0 ? floor : ceil;
    return result === 0 ? 0 : result;
  });
}