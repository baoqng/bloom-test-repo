export function roundAllHalfEvenV11(xs: number[]): number[] {
  // Validate input: check that all elements are finite
  for (const element of xs) {
    if (!Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values using banker's rounding (round-half-to-even)
  return xs.map(num => {
    const floor = Math.floor(num);
    const ceil = Math.ceil(num);
    const fraction = num - floor;

    // If fraction is exactly 0.5, use banker's rounding (round to nearest even)
    if (fraction === 0.5) {
      const result = floor % 2 === 0 ? floor : ceil;
      // Ensure we return +0 instead of -0
      return result === 0 ? 0 : result;
    }

    // Otherwise, use standard rounding
    return Math.round(num);
  });
}