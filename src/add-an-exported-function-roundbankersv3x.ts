export function roundBankersV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  // If x is an integer, return it as-is
  if (frac === 0) {
    return floor;
  }

  let result: number;

  // If fractional part is exactly 0.5, round to nearest even
  if (Math.abs(frac - 0.5) < 1e-10) {
    result = floor % 2 === 0 ? floor : ceil;
  } else {
    // Otherwise, round to nearest integer normally
    result = frac < 0.5 ? floor : ceil;
  }

  // Avoid returning -0; normalize to +0
  return result === 0 ? 0 : result;
}