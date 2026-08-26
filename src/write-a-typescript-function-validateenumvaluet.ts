// bloom-deps:

function validateEnumValue<T extends string | number>(value: unknown, allowed: unknown, caseSensitive: unknown): T {
  // Validate allowed
  if (!Array.isArray(allowed) || allowed.length === 0) {
    throw new TypeError("allowed must be a non-empty array");
  }

  // Validate each element in allowed
  for (const element of allowed) {
    if (typeof element !== "string" && typeof element !== "number") {
      throw new TypeError("each allowed value must be a string or number");
    }
  }

  // Validate caseSensitive
  if (typeof caseSensitive !== "boolean") {
    throw new TypeError("caseSensitive must be a boolean");
  }

  // Validate value
  if (typeof value !== "string" && typeof value !== "number") {
    throw new TypeError("value must be a string or number");
  }

  // Handle NaN
  if (typeof value === "number" && isNaN(value)) {
    throw new RangeError("value is not one of the allowed values");
  }

  // Perform matching
  if (!caseSensitive && typeof value === "string") {
    const lowercasedValue = value.toLowerCase();
    for (const element of allowed) {
      if (typeof element === "string" && element.toLowerCase() === lowercasedValue) {
        return element as T;
      }
    }
  } else {
    for (const element of allowed) {
      if (element === value) {
        return element as T;
      }
    }
  }

  throw new RangeError("value is not one of the allowed values");
}

export { validateEnumValue };