export function wFloorR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // Check if exactly halfway
  const frac = x - Math.floor(x);
  const isHalf = Math.abs(frac - 0.5) < 1e-12;
  if (isHalf) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // both odd shouldn't happen for integers, but fallback
    return rounded;
  }
  return Math.round(x);
}