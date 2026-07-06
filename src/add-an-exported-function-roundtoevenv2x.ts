export function roundToEvenV2(x: number): number {
  // Handle special cases
  if (!isFinite(x)) {
    return x;
  }

  // Handle -0
  if (x === 0) {
    return 0;
  }

  const floor = Math.floor(x);
  const frac = x - floor;

  // If x is already an integer
  if (frac === 0) {
    return floor;
  }

  // If frac is exactly 0.5, apply banker's rounding
  if (frac === 0.5) {
    // Round to even: if floor is even, return floor; otherwise return floor + 1
    const result = floor % 2 === 0 ? floor : floor + 1;
    return result === 0 ? 0 : result;
  }

  // If frac is exactly -0.5 (for negative numbers)
  if (frac === -0.5) {
    // For negative x, floor is already rounded down
    // We need to check if floor is even
    const result = floor % 2 === 0 ? floor : floor - 1;
    return result === 0 ? 0 : result;
  }

  // For all other cases, round to nearest integer
  const result = Math.round(x);
  return result === 0 ? 0 : result;
}