export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If Math.round rounded correctly (not a tie), use it
  // Math.round breaks ties by rounding toward +Infinity
  // We need to detect ties and apply banker's rounding
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  // If it's an exact integer
  if (floor === ceil) return x;
  const frac = x - floor; // fractional part, always in [0, 1)
  // Check if exactly halfway
  if (frac === 0.5) {
    // Banker's rounding: choose the even neighbor
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Not a tie: round to nearest
  return Math.round(x);
}