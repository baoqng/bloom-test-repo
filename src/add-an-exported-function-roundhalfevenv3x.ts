export function roundHalfEvenV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;

  // If x is an integer, return it as-is
  if (remainder === 0) {
    return floor === 0 ? 0 : floor; // Convert -0 to +0
  }

  // If remainder is less than 0.5, round down
  if (remainder < 0.5) {
    return floor;
  }

  // If remainder is greater than 0.5, round up
  if (remainder > 0.5) {
    return ceil;
  }

  // remainder === 0.5: round to the nearest even integer
  // If floor is even, round down; if floor is odd, round up
  const result = floor % 2 === 0 ? floor : ceil;
  return result === 0 ? 0 : result; // Convert -0 to +0
}