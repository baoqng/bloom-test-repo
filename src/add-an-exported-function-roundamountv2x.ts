export function roundAmountV2(x: number): number {
  const floor = Math.floor(x);
  const remainder = x - floor;

  // If remainder is exactly 0.5, use banker's rounding (round to nearest even)
  if (remainder === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact 0.5 fractional part
  if (remainder === -0.5) {
    return floor % 2 === 0 ? floor : floor - 1;
  }

  // Standard rounding for all other cases
  const result = Math.round(x);
  // Ensure we never return -0
  return result === 0 ? 0 : result;
}