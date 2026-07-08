export function wIdentityR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const fraction = x - Math.trunc(x);
  const absFraction = Math.abs(fraction);
  // Check if exactly at 0.5 tie
  if (Math.abs(absFraction - 0.5) < 1e-9) {
    const floor = Math.trunc(x) + (x < 0 ? -1 : 0);
    const ceil = floor + 1;
    // For negative numbers, floor is more negative
    if (x < 0) {
      const lo = Math.trunc(x) - 1; // more negative
      const hi = Math.trunc(x);     // closer to zero
      return (lo % 2 === 0) ? lo : hi;
    } else {
      const lo = Math.floor(x);
      const hi = lo + 1;
      return (lo % 2 === 0) ? lo : hi;
    }
  }
  return Math.round(x);
}