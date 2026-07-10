export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is exactly halfway (fractional part is 0.5)
  // Check if x has a fractional part of exactly 0.5
  const frac = x - Math.trunc(x);
  const isHalf = Math.abs(Math.abs(frac) - 0.5) < 1e-12;
  if (isHalf) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // Both odd shouldn't happen for integers differing by 1, but fallback
    return rounded;
  } else {
    // Standard rounding: round to nearest integer
    return Math.round(x);
  }
}