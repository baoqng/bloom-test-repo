// bloom-deps:

function parseNonNegativeFloat(value: unknown): number {
  if (typeof value === "number") {
    if (Number.isNaN(value) || value === Infinity || value === -Infinity) {
      throw new TypeError("Value must be finite");
    }
    if (value < 0 || Object.is(value, -0)) {
      throw new RangeError("Value must be non-negative");
    }
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      throw new SyntaxError("String must not be empty");
    }
    const parsed = parseFloat(trimmed);
    if (Number.isNaN(parsed)) {
      throw new SyntaxError("Not a valid number");
    }
    if (parsed === Infinity || parsed === -Infinity) {
      throw new RangeError("Value must be finite");
    }
    if (parsed < 0) {
      throw new RangeError("Value must be non-negative");
    }
    return parsed;
  }

  throw new TypeError("Expected a string or number");
}

export { parseNonNegativeFloat };