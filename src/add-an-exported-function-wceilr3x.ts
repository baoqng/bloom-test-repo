export function wCeilR3(x: number): number {
  const rounded = Math.round(x);
  // Check if x is exactly halfway (fractional part is 0.5)
  const frac = x - Math.floor(x);
  if (Math.abs(frac - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  return rounded;
}