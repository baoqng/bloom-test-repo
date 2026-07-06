export function bankersRoundV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  let result: number;

  // If x is an integer or very close to one, return it
  if (frac < 1e-10 || frac > 1 - 1e-10) {
    result = Math.round(x);
  }
  // If fractional part is less than 0.5, round down
  else if (frac < 0.5 - 1e-10) {
    result = floor;
  }
  // If fractional part is greater than 0.5, round up
  else if (frac > 0.5 + 1e-10) {
    result = ceil;
  }
  // Fractional part is exactly 0.5 (within tolerance)
  // Round to nearest even number
  else if (floor % 2 === 0) {
    result = floor;
  } else {
    result = ceil;
  }

  // Normalize -0 to +0
  if (result === 0) {
    return 0;
  }
  return result;
}