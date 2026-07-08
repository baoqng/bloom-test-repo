export function wFloorR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not exactly halfway, use standard rounding
  if (Math.abs(Math.abs(x % 1) - 0.5) > 1e-9) {
    return Math.round(x);
  }
  // Exactly halfway: round to even
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  if (floor % 2 === 0) {
    return floor;
  } else {
    return ceil;
  }
}