// bloom-deps:

function validateArrayLength(arr: unknown, min: unknown, max: unknown): unknown[] {
  if (!Array.isArray(arr)) {
    throw new TypeError("Expected an array");
  }

  if (typeof min !== "number" || typeof max !== "number") {
    throw new TypeError("min and max must be numbers");
  }

  if (!isFinite(min) || !isFinite(max)) {
    throw new TypeError("min and max must be finite");
  }

  if (min < 0 || !Number.isInteger(min)) {
    throw new RangeError("min must be a non-negative integer");
  }

  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("max must be a positive integer");
  }

  if (min > max) {
    throw new RangeError("min must not exceed max");
  }

  if (arr.length < min) {
    throw new RangeError(`Array length ${arr.length} is below minimum ${min}`);
  }

  if (arr.length > max) {
    throw new RangeError(`Array length ${arr.length} exceeds maximum ${max}`);
  }

  return arr as unknown[];
}

export { validateArrayLength };