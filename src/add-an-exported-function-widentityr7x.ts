export function wIdentityR7(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  // If fractional part is effectively 0, return the integer
  if (frac < 1e-11) {
    return floor;
  }
  
  // If fractional part is effectively 1, return floor + 1
  if (frac > 1 - 1e-11) {
    return floor + 1;
  }
  
  // If fractional part is exactly 0.5 (banker's rounding - round to even)
  if (Math.abs(frac - 0.5) < 1e-11) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // If fractional part is greater than 0.5, round up
  if (frac > 0.5) {
    return floor + 1;
  }
  
  // If fractional part is less than 0.5, round down
  return floor;
}