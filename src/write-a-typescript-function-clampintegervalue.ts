// bloom-deps:

function clampInteger(value: unknown, min: unknown, max: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("value must be a number");
  }
  if (typeof min !== "number") {
    throw new TypeError("min must be a number");
  }
  if (typeof max !== "number") {
    throw new TypeError("max must be a number");
  }
  if (!isFinite(value) || !isFinite(min) || !isFinite(max)) {
    throw new TypeError("All arguments must be finite");
  }
  if (!Number.isInteger(value)) {
    throw new RangeError("value must be an integer");
  }
  if (!Number.isInteger(min)) {
    throw new RangeError("min must be an integer");
  }
  if (!Number.isInteger(max)) {
    throw new RangeError("max must be an integer");
  }
  if (min > max) {
    throw new RangeError("min must not exceed max");
  }
  return Math.max(min, Math.min(max, value));
}

export { clampInteger };