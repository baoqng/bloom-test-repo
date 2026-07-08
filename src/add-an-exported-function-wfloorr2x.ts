export function wFloorR2(x: number): number {
  if (!isFinite(x)) return x;
  const lower = Math.floor(x);
  const upper = lower + 1;
  const diffLower = x - lower;
  const diffUpper = upper - x;
  if (Math.abs(diffLower - diffUpper) < 1e-9) {
    // It's a tie (x is at exactly .5) — round to even
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return diffLower <= diffUpper ? lower : upper;
}