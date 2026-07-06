export function wCeil(x: number): number {
  if (!isFinite(x)) return x;
  const floored = Math.floor(x);
  const frac = x - floored;
  if (frac === 0) return x;
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Exact halfway: round to even (banker's rounding)
    const lower = floored;
    const upper = floored + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Non-halfway: round to nearest
  return Math.round(x);
}