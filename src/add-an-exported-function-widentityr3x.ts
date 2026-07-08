export function wIdentityR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Exactly half: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}