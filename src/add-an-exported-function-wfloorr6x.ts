export function wFloorR6(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round works fine (but Math.round rounds .5 up, so we need custom logic)
  // Implement banker's rounding (round half to even)
  const frac = x % 1;
  const absFrac = Math.abs(frac);
  
  // Check if exactly at .5 tie
  if (Math.abs(absFrac - 0.5) < 1e-12) {
    // It's a tie - round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick whichever of floor/ceil is even
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  
  // Not a tie - round to nearest
  return Math.round(x);
}