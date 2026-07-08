export function wFloorR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is exactly halfway (fractional part is 0.5)
  if (Math.abs(x - Math.floor(x) - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Non-tie: round to nearest
  return Math.round(x);
}