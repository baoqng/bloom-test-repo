export function wFloorR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not exactly halfway, Math.round is fine (it rounds half-up for positive,
  // half-down for negative, but we need to check)
  // Actually, let's implement banker's rounding from scratch:
  // 1. Find the two nearest integers
  const lower = Math.floor(x);
  const upper = Math.ceil(x);
  const diffLower = x - lower;
  const diffUpper = upper - x;
  const epsilon = 1e-9;

  if (Math.abs(diffLower - diffUpper) < epsilon) {
    // Exactly halfway (or very close) - round to even
    if (lower % 2 === 0) return lower;
    return upper;
  } else if (diffLower < diffUpper) {
    // Closer to lower
    return lower;
  } else {
    // Closer to upper
    return upper;
  }
}