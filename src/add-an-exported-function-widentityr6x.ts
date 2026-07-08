export function wIdentityR6(x: number): number {
  const floored = Math.floor(x);
  const fractional = x - floored;

  // If fractional part is exactly 0.5
  if (Math.abs(fractional - 0.5) < 1e-10) {
    // Round to nearest even number
    return floored % 2 === 0 ? floored : floored + 1;
  }

  // If fractional part is less than 0.5, round down
  if (fractional < 0.5) {
    return floored;
  }

  // If fractional part is greater than 0.5, round up
  return floored + 1;
}