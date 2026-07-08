export function wFloorR8(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If Math.round rounded correctly (not a tie), return it
  // Math.round does round-half-up (toward +Infinity for .5)
  // We need round-half-to-even (banker's rounding)
  
  // Check if x is exactly halfway between two integers
  const fraction = x - Math.floor(x);
  if (Math.abs(fraction - 0.5) < 1e-9) {
    // It's a tie - round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  
  // Not a tie - standard rounding
  return Math.round(x);
}