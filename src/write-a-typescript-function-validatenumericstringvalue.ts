// bloom-deps:

function validateNumericString(value: unknown, min: unknown, max: unknown): number {
  // Validate value type
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  // Validate empty/whitespace
  if (value.trim() === "") {
    throw new RangeError("value must not be empty");
  }

  // Validate min
  if (typeof min !== "number" || !Number.isFinite(min)) {
    throw new TypeError("min must be a finite number");
  }

  // Validate max
  if (typeof max !== "number" || !Number.isFinite(max)) {
    throw new TypeError("max must be a finite number");
  }

  // Validate max >= min
  if (max < min) {
    throw new RangeError("max must be greater than or equal to min");
  }

  // Trim and validate numeric content
  const trimmed = value.trim();

  // Check for valid numeric characters: optional leading minus, digits, at most one decimal point
  const validNumericPattern = /^-?\d*\.?\d+$|^-?\d+\.?\d*$/;
  const isValidPattern = validNumericPattern.test(trimmed);

  const parsed = Number(trimmed);

  if (isNaN(parsed) || !isValidPattern) {
    throw new RangeError("value must be a valid number");
  }

  // Validate range
  if (parsed < min || parsed > max) {
    throw new RangeError(`value must be between ${min} and ${max}`);
  }

  return parsed;
}

export { validateNumericString };