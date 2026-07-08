export function wFloorR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not exactly halfway, Math.round is correct (but Math.round rounds .5 up)
  // We need to detect the halfway case and apply banker's rounding
  const floor = Math.floor(x);
  const frac = x - floor;
  // Check if fractional part is exactly 0.5
  if (Math.abs(frac - 0.5) < 1e-12) {
    // Halfway case: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  // Not halfway: standard rounding
  return Math.round(x);
}