export function wCeilR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // Check if x is exactly halfway between two integers
  const frac = x - Math.floor(x);
  if (frac === 0.5 || frac === -0.5 || (x % 1 !== 0 && Math.abs(Math.abs(x % 1) - 0.5) < 1e-12)) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}