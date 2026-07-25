// bloom-deps:

export function roundAllHalfEvenV11(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value
  const result: number[] = xs.map((x) => {
    // Get the integer part and fractional part
    const integer = Math.floor(x);
    const fractional = x - integer;

    // If fractional part is exactly 0.5, apply banker's rounding (round to even)
    if (fractional === 0.5) {
      // If integer is even, round down; if odd, round up
      return integer % 2 === 0 ? integer : integer + 1;
    }

    // If fractional part is exactly -0.5, apply banker's rounding
    if (fractional === -0.5) {
      // For negative numbers with -0.5 fractional part
      // integer is already floored, so we need to check the absolute value
      const absInteger = Math.abs(integer);
      if (absInteger % 2 === 0) {
        return integer;
      } else {
        return integer - 1;
      }
    }

    // For all other cases, use standard rounding (nearest)
    return Math.round(x);
  });

  return result;
}