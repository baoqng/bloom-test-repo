export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const eps = 1e-9;
  const fraction = x - Math.floor(x);
  // Check if exactly .5 (tie case) - use banker's rounding (round half to even)
  if (Math.abs(fraction - 0.5) < eps) {
    const lower = Math.floor(x);
    const upper = lower + 1;
    // Round to even
    if (lower % 2 === 0 || lower % 2 === -0) {
      return lower;
    } else {
      return upper;
    }
  }
  // Non-tie: standard rounding (round to nearest)
  return Math.round(x);
}