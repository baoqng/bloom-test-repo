export function wCeilR2(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  const EPS = 1e-9;
  if (Math.abs(frac - 0.5) < EPS) {
    // Banker's rounding: round half to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}