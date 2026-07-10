export function wFloorR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round is fine (but Math.round rounds .5 up, so we need custom logic)
  // Implement banker's rounding (round half to even)
  const floor = Math.floor(x);
  const decimal = x - floor;
  const eps = 1e-9;
  const isHalf = Math.abs(decimal - 0.5) < eps;
  if (isHalf) {
    // Tie: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    // Non-tie: round to nearest
    return Math.round(x);
  }
}