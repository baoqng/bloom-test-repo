export function bankersRoundV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  }

  if (fraction > 0.5) {
    return ceil;
  }

  // fraction === 0.5, round to even
  // If floor is even, return floor; otherwise return ceil
  const result = floor % 2 === 0 ? floor : ceil;
  // Avoid returning -0; normalize to +0
  return result === 0 ? 0 : result;
}