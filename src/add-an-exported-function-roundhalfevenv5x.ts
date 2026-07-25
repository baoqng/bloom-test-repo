// bloom-deps:

export function roundHalfEvenV5(x: number): number {
  // Validate input: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle the integer case
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = floor + 1;

  // Calculate the fractional part
  const fract = x - floor;

  // If fractional part is less than 0.5, round down
  if (fract < 0.5) {
    return floor;
  }

  // If fractional part is greater than 0.5, round up
  if (fract > 0.5) {
    return ceil;
  }

  // Exactly at 0.5 (tie case): round to even
  // If floor is even, round down; if floor is odd, round up
  return floor % 2 === 0 ? floor : ceil;
}