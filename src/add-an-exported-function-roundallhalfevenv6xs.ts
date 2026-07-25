// bloom-deps:

export function roundAllHalfEvenV6(xs: number[]): number[] {
  // Type validation guard - must fire BEFORE any arithmetic
  for (let i = 0; i < xs.length; i++) {
    const element = xs[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Round each element using half-even (banker's rounding)
  const result: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const num = xs[i];
    const floored = Math.floor(num);
    const fractional = num - floored;

    let rounded: number;

    if (fractional === 0.5) {
      // Exact tie: round to nearest even
      if (floored % 2 === 0) {
        rounded = floored;
      } else {
        rounded = floored + 1;
      }
    } else if (fractional === -0.5) {
      // Negative exact tie: round to nearest even
      const ceiled = Math.ceil(num);
      if (ceiled % 2 === 0) {
        rounded = ceiled;
      } else {
        rounded = floored;
      }
    } else {
      // Not a tie: use standard rounding (nearest integer)
      rounded = Math.round(num);
    }

    result.push(rounded);
  }

  return result;
}