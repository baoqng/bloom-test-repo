export function wIdentityR2(x: number): number {
  // Handle null/undefined by coercing to NaN
  if (x === null || x === undefined) {
    return NaN;
  }
  // Handle NaN, Infinity, -Infinity
  if (!isFinite(x) || isNaN(x)) {
    return x;
  }
  // Banker's rounding (round-half-to-even)
  const rounded = Math.round(x);
  // Check if x is exactly at a .5 tie
  const frac = x - Math.trunc(x);
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-12) {
    // It's a tie — round to even
    const floor = Math.trunc(x);
    const ceil = x > 0 ? floor + 1 : floor - 1;
    // Pick the even one
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  }
  return rounded;
}