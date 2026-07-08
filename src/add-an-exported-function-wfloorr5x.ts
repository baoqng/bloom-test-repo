export function wFloorR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly at 0.5 (tie case)
  if (Math.abs(diff - 0.5) < 1e-14) {
    // Banker's rounding: round to even
    const low = Math.floor(x);
    const high = Math.ceil(x);
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}