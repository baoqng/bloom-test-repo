export function wCeilR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // Check if it's exactly halfway
  const frac = x - Math.floor(x);
  const isHalf = Math.abs(frac - 0.5) < 1e-12;
  if (isHalf) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    if (ceil % 2 === 0) return ceil;
    return floor; // fallback
  }
  // Non-tie: standard rounding (round to nearest)
  return Math.round(x);
}