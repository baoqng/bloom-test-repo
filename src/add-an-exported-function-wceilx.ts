export function wCeil(x: number): number {
  if (!isFinite(x)) return x + 0; // handles NaN, Infinity, -Infinity; +0 converts -0 for NaN case
  if (x === 0) return 0; // handles both +0 and -0, returns +0
  
  const floored = Math.floor(x);
  const frac = x - floored;
  
  // Check if fractional part is exactly 0.5
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to nearest even
    const lower = floored;
    const upper = floored + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  
  // Otherwise, standard rounding to nearest integer
  return Math.round(x) || 0; // || 0 to convert -0 to +0
}