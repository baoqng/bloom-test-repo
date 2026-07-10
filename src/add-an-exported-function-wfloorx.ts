export function wFloor(x: number): number {
  if (!Number.isFinite(x)) return Math.round(x);
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not exactly a half, use standard rounding
  if (Math.abs(Math.abs(x % 1) - 0.5) < 1e-12) {
    // Exactly halfway: round to even (banker's rounding)
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}