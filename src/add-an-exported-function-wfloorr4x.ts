export function wFloorR4(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round works (but Math.round rounds .5 up, so we use custom logic)
  // We need banker's rounding (round half to even)
  
  // Check if x is exactly halfway between two integers
  const lower = Math.floor(x);
  const upper = lower + 1;
  const frac = x - lower;
  
  // Use a small epsilon for floating point comparison
  const eps = 1e-9;
  
  if (Math.abs(frac - 0.5) < eps) {
    // It's a tie - round to even
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    // Not a tie - round to nearest
    return Math.round(x);
  }
}