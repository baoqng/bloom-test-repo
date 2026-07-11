export function wFloorR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round is correct (but Math.round rounds .5 up, so we use custom logic)
  // We need banker's rounding: round half to even
  // Check if x is exactly halfway between two integers
  const fraction = x - Math.floor(x);
  if (Math.abs(fraction - 0.5) < 1e-12) {
    // It's a tie - round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  // Not a tie - round to nearest
  return Math.round(x);
}