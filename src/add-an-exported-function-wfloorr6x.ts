export function wFloorR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not exactly halfway, Math.round is fine (but it rounds .5 up, so we need custom logic)
  // Implement banker's rounding (round half to even)
  const floor = Math.floor(x);
  const frac = x - floor;
  // Check if fractional part is exactly 0.5
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Tie: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Not a tie: round to nearest
  return Math.round(x);
}