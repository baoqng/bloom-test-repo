export function roundAllHalfEvenV9(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const element of xs) {
    if (!Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values using banker's rounding
  return xs.map((num) => {
    // Banker's rounding: round to nearest even when exactly halfway
    const floored = Math.floor(num);
    const fractional = num - floored;

    let result: number;

    // If not exactly at 0.5, use standard rounding
    if (Math.abs(fractional - 0.5) > 1e-10) {
      result = Math.round(num);
    } else {
      // At exactly 0.5: round to nearest even
      const floored_int = floored;
      if (floored_int % 2 === 0) {
        result = floored_int;
      } else {
        result = floored_int + 1;
      }
    }

    // Convert -0 to +0
    if (result === 0) {
      return 0;
    }
    return result;
  });
}