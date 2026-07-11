export function wCeilR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, use standard rounding to nearest
  // Check if x is exactly a half-integer
  const frac = x - Math.floor(x);
  const isHalf = Math.abs(frac - 0.5) < 1e-12;
  if (isHalf) {
    // Banker's rounding: round to even
    const low = Math.floor(x);
    const high = Math.ceil(x);
    if (low % 2 === 0) return low;
    return high;
  }
  // Not a tie: round to nearest integer (standard)
  return Math.round(x);
}