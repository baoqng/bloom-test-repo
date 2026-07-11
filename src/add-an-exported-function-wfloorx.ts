export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly at 0.5 (tie case)
  if (Math.abs(diff - 0.5) < 1e-14) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}