// bloom-deps:

export function roundQty(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;
  if (diff === 0.5) {
    // Banker's rounding: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
  const result = Math.round(x);
  // Ensure positive zero, not negative zero
  return result === 0 ? 0 : result;
}