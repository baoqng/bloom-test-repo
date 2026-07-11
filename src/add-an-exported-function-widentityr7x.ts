export function wIdentityR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = Math.abs(x - rounded);
  // Check if we're at a tie (exactly 0.5)
  if (Math.abs(Math.abs(x % 1) - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}