export function wFloorR5(x: number): number {
  const rounded = Math.round(x);
  // Check if x is exactly halfway (fractional part is 0.5)
  const fraction = x - Math.floor(x);
  const isHalfway = Math.abs(fraction - 0.5) < 1e-9;
  if (isHalfway) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0 || lower % 2 === -0) {
      // Check if lower is even
      if (Math.abs(lower % 2) === 0) return lower;
      return upper;
    } else {
      if (Math.abs(upper % 2) === 0) return upper;
      return lower;
    }
  }
  return rounded;
}