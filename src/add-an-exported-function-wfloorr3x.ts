export function wFloorR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round is correct (it rounds half up, but we need standard rounding)
  // Actually, we need to implement banker's rounding from scratch
  
  // Get the two candidate integers
  const lo = Math.floor(x);
  const hi = Math.ceil(x);
  
  // If already integer
  if (lo === hi) return x;
  
  const diffLo = x - lo;
  const diffHi = hi - x;
  
  // Check if it's exactly a tie (fractional part is 0.5)
  if (Math.abs(diffLo - 0.5) < 1e-12) {
    // Tie: round to even
    if (lo % 2 === 0) return lo;
    return hi;
  }
  
  // Not a tie: round to nearest
  if (diffLo < diffHi) return lo;
  return hi;
}