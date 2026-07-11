export function wIdentity(x: number): number {
  const rounded = Math.round(x);
  // Check for exact .5 tie case
  const frac = x - Math.trunc(x);
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  }
  return rounded;
}