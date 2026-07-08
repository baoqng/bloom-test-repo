export function wCeilR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not exactly halfway, use standard rounding (round to nearest)
  // For non-halfway values, Math.round works but we need "round half to even"
  // Check if x is exactly halfway between two integers
  const frac = x - Math.floor(x);
  if (frac === 0.5) {
    // x is exactly halfway: n + 0.5
    const lower = Math.floor(x);
    const upper = lower + 1;
    // Pick the even one
    if (lower % 2 === 0) return lower;
    return upper;
  } else if (frac === 0) {
    return x;
  } else {
    // Not halfway: round to nearest integer
    return Math.round(x);
  }
}