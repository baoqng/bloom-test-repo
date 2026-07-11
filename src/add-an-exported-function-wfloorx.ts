export function wFloor(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  if (Number.isInteger(x)) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // Check if exactly .5 (tie case)
  if (Math.abs(absFrac - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const truncated = Math.trunc(x);
    const lower = x > 0 ? truncated : truncated - 1;
    const upper = x > 0 ? truncated + 1 : truncated;
    // Pick the even one
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Non-tie: standard rounding (round to nearest integer)
  return Math.round(x);
}