export function wHalfUpR7(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Check if exactly at 0.5 tie
  if (Math.abs(decimal - 0.5) < 1e-9) {
    // Round to even (banker's rounding)
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}