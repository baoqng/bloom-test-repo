export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  const eps = 1e-9;
  if (Math.abs(frac - 0.5) < eps) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
  return Math.round(x);
}