export function wCeil(x: number): number {
  if (Number.isInteger(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  // Check if fractional part is exactly 0.5 (tie case)
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Non-tie: standard rounding (round to nearest)
  return Math.round(x);
}