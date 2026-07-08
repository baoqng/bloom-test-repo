export function wFloorR8(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  // If fractional part is exactly 0.5, apply banker's rounding (round to even)
  if (Math.abs(frac - 0.5) < 1e-10) {
    // Round to the nearest even number
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // If fractional part > 0.5, round up
  if (frac > 0.5) {
    return floor + 1;
  }
  
  // Otherwise round down
  return floor;
}