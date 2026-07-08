export function wCeilR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly halfway
  if (Math.abs(diff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Not a tie: round to nearest
  return Math.round(x);
}