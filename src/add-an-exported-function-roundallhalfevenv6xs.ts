// bloom-deps:

export function roundAllHalfEvenV6(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value
  const result = xs.map((x) => {
    // Get the integer part and fractional part
    const integer = Math.floor(x);
    const fractional = x - integer;

    // If fractional part is exactly 0.5, apply banker's rounding (round to even)
    if (fractional === 0.5) {
      // Round to nearest even integer
      return integer % 2 === 0 ? integer : integer + 1;
    }

    // If fractional part is exactly -0.5, apply banker's rounding
    if (fractional === -0.5) {
      // For negative numbers, Math.floor rounds down (more negative)
      // We need to round the absolute value to even, then apply sign
      const absInteger = Math.floor(Math.abs(x));
      const rounded = absInteger % 2 === 0 ? absInteger : absInteger + 1;
      return -rounded;
    }

    // For all other cases, use standard rounding (nearest integer)
    return Math.round(x);
  });

  return result;
}