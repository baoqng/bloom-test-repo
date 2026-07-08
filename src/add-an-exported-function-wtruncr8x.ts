export function wTruncR8(x: number): number {
  const floor = Math.floor(x);
  const remainder = x - floor;
  
  if (remainder < 0.5) {
    return floor;
  } else if (remainder > 0.5) {
    return floor + 1;
  } else {
    // remainder === 0.5, use banker's rounding (round to even)
    return floor % 2 === 0 ? floor : floor + 1;
  }
}