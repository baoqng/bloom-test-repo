export function wCeilR6(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  const epsilon = 1e-9;
  
  // Check if fractional part is exactly 0.5 (tie case)
  if (Math.abs(frac - 0.5) < epsilon) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    // Pick the even one
    if (lower % 2 === 0 || lower % 2 === -0) {
      // Check if lower is even
      if (Math.abs(lower % 2) < epsilon) {
        return lower;
      } else {
        return upper;
      }
    }
    if (Math.abs(lower % 2) === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  
  // Non-tie case: standard rounding (round to nearest)
  return Math.round(x);
}