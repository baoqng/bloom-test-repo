export function wCeilR8(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // Check if x is exactly halfway between two integers
  const fraction = x % 1;
  const absFraction = Math.abs(fraction);
  // Detect exact .5 case
  if (Math.abs(absFraction - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Non-halfway: round to nearest integer
  return Math.round(x);
}