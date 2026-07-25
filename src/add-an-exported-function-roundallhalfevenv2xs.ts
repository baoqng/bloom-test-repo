export function roundAllHalfEvenV2(xs: number[]): number[] {
  // Type validation guard: check all elements are finite numbers
  for (let i = 0; i < xs.length; i++) {
    const element = xs[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its round-half-to-even value
  const result = xs.map((x) => {
    // Get the integer part and fractional part
    const intPart = Math.trunc(x);
    const fract = x - intPart;

    // For positive numbers
    if (x >= 0) {
      // If fractional part is exactly 0.5, round to nearest even
      if (fract === 0.5) {
        return intPart % 2 === 0 ? intPart : intPart + 1;
      }
      // Otherwise round to nearest integer
      return Math.round(x);
    }

    // For negative numbers
    // If fractional part is exactly -0.5, round to nearest even
    if (fract === -0.5) {
      // intPart for -0.5 is 0 (Math.trunc(-0.5) === 0 which is -0)
      // We need to ensure we return +0 not -0
      const rounded = intPart % 2 === 0 ? intPart : intPart - 1;
      return rounded === 0 ? 0 : rounded;
    }
    // Otherwise round to nearest integer
    return Math.round(x);
  });

  return result;
}