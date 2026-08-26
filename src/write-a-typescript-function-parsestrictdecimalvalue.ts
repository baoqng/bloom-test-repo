// bloom-deps:

export function parseStrictDecimal(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError("Input must not be empty");
  }

  // Check for Infinity/-Infinity before the regex check so we throw RangeError
  if (trimmed === "Infinity" || trimmed === "-Infinity") {
    throw new RangeError("Value must be finite");
  }

  // Check for scientific notation: if the trimmed string contains 'e' or 'E'
  // and looks like a scientific notation number, throw SyntaxError
  if (/[eE]/.test(trimmed)) {
    throw new SyntaxError("Scientific notation is not allowed");
  }

  // Validate format strictly: only allow optional minus, digits, optional decimal point with digits
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new SyntaxError("Not a valid number");
  }

  const parsed = parseFloat(trimmed);

  if (isNaN(parsed)) {
    throw new SyntaxError("Not a valid number");
  }

  if (!isFinite(parsed)) {
    throw new RangeError("Value must be finite");
  }

  return parsed;
}