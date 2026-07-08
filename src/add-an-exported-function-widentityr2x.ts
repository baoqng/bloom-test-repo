export function wIdentityR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly halfway
  if (Math.abs(diff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    if (ceil % 2 === 0) return ceil;
    return rounded;
  }
  return rounded;
}