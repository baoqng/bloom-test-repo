export function wFloorR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, just use standard rounding
  if (Math.abs(Math.abs(x % 1) - 0.5) < 1e-9) {
    // Tie case: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // Both odd shouldn't happen for consecutive integers, but fallback
    return rounded;
  }
  return Math.round(x);
}