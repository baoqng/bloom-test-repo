export function wFloorR4(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, just use standard rounding
  if (Math.abs(Math.abs(x % 1) - 0.5) < 1e-9) {
    // Tie case: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}