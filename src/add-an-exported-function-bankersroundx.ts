export function bankersRound(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  let result: number;

  // If x is an integer, return it
  if (fraction === 0) {
    result = floor;
  }
  // If the fractional part is exactly 0.5, round to the nearest even integer
  else if (fraction === 0.5) {
    // Round to the even number
    result = floor % 2 === 0 ? floor : ceil;
  }
  // If the fractional part is less than 0.5, round down
  else if (fraction < 0.5) {
    result = floor;
  }
  // If the fractional part is greater than 0.5, round up
  else {
    result = ceil;
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}