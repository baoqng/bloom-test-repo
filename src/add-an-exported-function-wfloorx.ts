export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If Math.round already gave a non-tie result, use it
  // Check if x is exactly halfway between two integers
  const lower = Math.floor(x);
  const upper = lower + 1;
  const mid = lower + 0.5;
  if (x === mid) {
    // Banker's rounding: round to even
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else if (x === Math.floor(x)) {
    // Integer
    return x;
  } else {
    // Not a tie, use normal rounding
    return Math.round(x);
  }
}