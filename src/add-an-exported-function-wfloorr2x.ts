export function wFloorR2(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly halfway
  if (Math.abs(diff - 0.5) < 1e-14) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}