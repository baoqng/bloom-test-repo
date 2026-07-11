export function wCeilR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly halfway
  if (Math.abs(diff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const low = Math.floor(x);
    const high = Math.ceil(x);
    if (low % 2 === 0) return low;
    return high;
  }
  // Not a tie: standard rounding
  return Math.round(x);
}