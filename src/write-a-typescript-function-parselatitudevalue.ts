// bloom-deps:

export function parseLatitude(value: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("Expected a number");
  }
  if (!isFinite(value) || isNaN(value)) {
    throw new TypeError("Value must be finite");
  }
  if (Object.is(value, -0)) {
    throw new RangeError("Latitude must not be negative zero");
  }
  if (value < -90 || value > 90) {
    throw new RangeError("Latitude must be between -90 and 90");
  }
  return value;
}