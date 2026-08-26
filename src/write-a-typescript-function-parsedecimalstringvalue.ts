// bloom-deps:

function parseDecimalString(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError("String must not be empty");
  }

  if (!trimmed.includes(".")) {
    throw new SyntaxError("Decimal point is required");
  }

  // Check for invalid characters: only [0-9+\-.] allowed
  if (/[^0-9+\-.]/.test(trimmed)) {
    throw new SyntaxError("Not a valid decimal number");
  }

  const parsed = parseFloat(trimmed);

  if (isNaN(parsed)) {
    throw new SyntaxError("Not a valid decimal number");
  }

  if (!isFinite(parsed)) {
    throw new RangeError("Value must be finite");
  }

  return parsed;
}

export { parseDecimalString };