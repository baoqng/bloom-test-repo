export function wIdentityR7(x: number): number {
  const rounded = Math.round(x);
  const frac = x - Math.floor(x);
  // Check if exactly halfway
  if (Math.abs(frac - 0.5) < 1e-12 || Math.abs(frac + 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) {
      return floor;
    } else if (ceil % 2 === 0) {
      return ceil;
    } else {
      return rounded;
    }
  }
  return rounded;
}