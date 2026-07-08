export function wCeilR6(x: number): number {
  if (typeof x !== 'number') return NaN;
  if (!isFinite(x)) return x;
  if (x !== x) return NaN;

  const floor = Math.floor(x);
  const frac = x - floor;

  // Check if fractional part is exactly 0.5 (tie)
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to nearest even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }

  // Non-tie: standard rounding (round half away from zero behavior, i.e., normal Math.round)
  return Math.round(x);
}