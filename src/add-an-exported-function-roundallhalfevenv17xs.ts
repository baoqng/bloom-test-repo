export function roundAllHalfEvenV17(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value using banker's rounding (half-to-even)
  return xs.map((x) => {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // For negative numbers, we need to handle the fractional part differently
    if (x < 0 && fract !== 0) {
      const ceil = Math.ceil(x);
      const fracPart = x - ceil;

      // Check if this is an exact tie (0.5)
      if (fracPart === -0.5) {
        // Half-to-even: round to the nearest even number
        const result = ceil % 2 === 0 ? ceil : floor;
        // Avoid returning -0; convert to +0
        return result === 0 ? 0 : result;
      }

      // Not a tie; round to nearest
      return fracPart < -0.5 ? floor : ceil;
    }

    // For non-negative numbers
    if (fract === 0.5) {
      // Half-to-even: round to the nearest even number
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // Not a tie; round to nearest
    return fract < 0.5 ? floor : floor + 1;
  });
}