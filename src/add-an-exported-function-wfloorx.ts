export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If Math.round already gave a non-half result, use it
  // Math.round rounds .5 up (toward +Infinity), so we need to check
  // if x is exactly halfway between two integers
  const lower = Math.floor(x);
  const upper = Math.ceil(x);
  if (lower === upper) return x; // already integer
  const mid = (lower + upper) / 2;
  if (x === mid) {
    // Exactly halfway: round to even
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // For negative numbers, lower%2 might be -1
    if (lower % 2 === 0 || lower % 2 === -0) return lower;
    return upper;
  }
  // Not exactly halfway: round to nearest
  return Math.round(x);
}