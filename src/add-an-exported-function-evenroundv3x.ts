export function evenRoundV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  let result: number;

  if (frac < 0.5) {
    result = floor;
  } else if (frac > 0.5) {
    result = ceil;
  } else if (floor % 2 === 0) {
    result = floor;
  } else {
    result = ceil;
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}