export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  // Check if fractional part is exactly 0.5
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
  return Math.round(x);
}