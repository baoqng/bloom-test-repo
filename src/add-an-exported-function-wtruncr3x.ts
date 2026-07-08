export function wTruncR3(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  const eps = 1e-9;
  // Check if fractional part is exactly 0.5 (within epsilon)
  if (Math.abs(frac - 0.5) < eps) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  return Math.round(x);
}