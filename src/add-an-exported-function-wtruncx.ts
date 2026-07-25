export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly at 0.5 (tie case)
  if (Math.abs(diff - 0.5) < 1e-15) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}