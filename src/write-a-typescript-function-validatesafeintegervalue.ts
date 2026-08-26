// bloom-deps:

export function validateSafeInteger(value: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("Expected a number");
  }

  if (!isFinite(value)) {
    throw new TypeError("Value must be finite");
  }

  if (Math.floor(value) !== value) {
    throw new RangeError("Value must be an integer");
  }

  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Value exceeds safe integer range");
  }

  return value;
}