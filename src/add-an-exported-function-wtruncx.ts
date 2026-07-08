export function wTrunc(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = x - floor;
  const diffCeil = ceil - x;
  const epsilon = 1e-9;
  // Check if exactly halfway (fractional part is 0.5)
  if (Math.abs(diffFloor - 0.5) < epsilon && Math.abs(diffCeil - 0.5) < epsilon) {
    // Bankers rounding: round to even
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Otherwise, standard rounding
  return Math.round(x);
}