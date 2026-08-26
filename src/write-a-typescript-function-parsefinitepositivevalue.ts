// bloom-deps:

function parseFinitePositive(value: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("Expected a number");
  }
  if (!isFinite(value) || isNaN(value)) {
    throw new TypeError("Value must be finite");
  }
  if (value <= 0 || Object.is(value, -0)) {
    throw new RangeError("Value must be positive");
  }
  return value;
}

export { parseFinitePositive };