export function halfEvenRoundV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  // If x is an integer, return it
  if (fraction === 0) {
    return floor;
  }

  // If fraction is exactly 0.5, round to even
  if (Math.abs(fraction - 0.5) < 1e-10) {
    // Round to the even number
    const result = floor % 2 === 0 ? floor : ceil;
    // Avoid returning -0; normalize to +0
    return result === 0 ? 0 : result;
  }

  // If fraction is less than 0.5, round down (towards floor)
  if (fraction < 0.5) {
    return floor;
  }

  // If fraction is greater than 0.5, round up (towards ceil)
  return ceil;
}