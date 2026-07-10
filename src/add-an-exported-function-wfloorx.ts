export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is exactly halfway between two integers
  if (Math.abs(Math.abs(x % 1) - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    return lower;
  }
  // Non-tie: standard rounding (round to nearest)
  return Math.round(x);
}