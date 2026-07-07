export function wFloorR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not exactly halfway, just use Math.round
  // Math.round rounds .5 up, so we need to check for exact .5 cases
  const frac = x - Math.floor(x);
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Exact halfway case: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}