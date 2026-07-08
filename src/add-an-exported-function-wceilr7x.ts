export function wCeilR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const frac = x - Math.floor(x);
  // Check if exactly at 0.5 (tie)
  if (Math.abs(frac - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const low = Math.floor(x);
    const high = Math.ceil(x);
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}