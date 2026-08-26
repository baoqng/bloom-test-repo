// bloom-deps:

export function constrainToRange(value: unknown, min: unknown, max: unknown, inclusive: unknown): number {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError("value must be a finite number");
  }
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError("min must be a finite number");
  }
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError("max must be a finite number");
  }
  if (typeof inclusive !== 'boolean') {
    throw new TypeError("inclusive must be a boolean");
  }
  if (min > max) {
    throw new RangeError("min must not exceed max");
  }

  if (inclusive) {
    return Math.max(min, Math.min(max, value));
  } else {
    if (value === min || value === max) {
      throw new RangeError("Value is at excluded boundary");
    }
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }
}