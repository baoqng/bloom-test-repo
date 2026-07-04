// bloom-deps:

/**
 * Clamps a number to an inclusive [min, max] range.
 * 
 * @param value - The number to clamp
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns The clamped value
 * 
 * @example
 * clampToRange_35(5, 10, 20) // returns 10
 * clampToRange_35(15, 10, 20) // returns 15
 * clampToRange_35(25, 10, 20) // returns 20
 */
function clampToRange_35(value: number, min: number, max: number): number {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

export { clampToRange_35 };