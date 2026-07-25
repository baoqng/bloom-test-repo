export function wFloor(x: number): number {
  if (Number.isInteger(x)) return x;
  const fraction = x - Math.trunc(x);
  const absFraction = Math.abs(fraction);
  // Check if exactly .5 (tie case) - use banker's rounding (round half to even)
  if (Math.abs(absFraction - 0.5) < 1e-9) {
    const truncated = Math.trunc(x);
    // Round to nearest even
    const lower = truncated; // toward zero
    const higher = truncated + (x >= 0 ? 1 : -1); // away from zero
    // Pick the even one
    if (lower % 2 === 0) return lower;
    return higher;
  }
  // Non-tie: standard rounding (round half away from zero equivalent to Math.round behavior)
  return Math.round(x);
}