export function wIdentityR3(x: number): number {
  if (x === null || x === undefined) return 0;
  if (!isFinite(x)) return x;
  if (isNaN(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly 0.5 (tie case)
  if (Math.abs(diff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}