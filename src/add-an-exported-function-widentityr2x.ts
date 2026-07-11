export function wIdentityR2(x: number): number {
  const rounded = Math.round(x);
  // Check if x is exactly halfway (fractional part is 0.5)
  const fraction = x - Math.floor(x);
  if (Math.abs(fraction - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even one
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  }
  return rounded;
}