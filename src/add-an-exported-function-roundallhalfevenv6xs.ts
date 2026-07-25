// bloom-deps:

export function roundAllHalfEvenV6(xs: number[]): number[] {
  // Validate all elements are finite before any processing
  for (const element of xs) {
    if (typeof element !== 'number' || !isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its banker's rounded value
  return xs.map((x: number): number => {
    // Get the integer part and fractional part
    const integer = Math.floor(x);
    const fractional = x - integer;

    // Check for exact tie (0.5)
    if (fractional === 0.5) {
      // Round to nearest even integer
      // If integer is even, round down (return integer)
      // If integer is odd, round up (return integer + 1)
      return integer % 2 === 0 ? integer : integer + 1;
    } else if (fractional === -0.5) {
      // For negative ties, the floor is one less than the actual integer
      // e.g., floor(-2.5) = -3, but we want to consider -2 and -3
      const ceiling = Math.ceil(x);
      return ceiling % 2 === 0 ? ceiling : ceiling - 1;
    } else {
      // Standard rounding: round to nearest integer
      return Math.round(x);
    }
  });
}