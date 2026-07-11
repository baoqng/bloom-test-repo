export function wTruncR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = Math.abs(x - rounded);
  // Not a tie case: just round normally
  if (Math.abs(x % 1) !== 0.5) {
    return rounded;
  }
  // Tie case: round to even
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  if (floor % 2 === 0) return floor;
  return ceil;
}