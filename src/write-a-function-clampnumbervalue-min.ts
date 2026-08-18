// bloom-deps:

export function clampNumber(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeError(`value must be a valid number`);
  }
  if (typeof min !== 'number' || isNaN(min)) {
    throw new TypeError(`min must be a valid number`);
  }
  if (typeof max !== 'number' || isNaN(max)) {
    throw new TypeError(`max must be a valid number`);
  }
  if (min > max) {
    throw new Error(`min must be less than or equal to max`);
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}