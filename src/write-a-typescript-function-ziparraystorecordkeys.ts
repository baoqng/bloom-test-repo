// bloom-deps:

function zipArraysToRecord(keys: unknown, values: unknown): Record<string, unknown> {
  // Validate keys is an array
  if (!Array.isArray(keys)) {
    throw new TypeError("keys must be an array");
  }

  // Validate values is an array
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }

  // Validate arrays have the same length
  if (keys.length !== values.length) {
    throw new RangeError("keys and values arrays must have the same length");
  }

  // Track seen keys to detect duplicates
  const seenKeys = new Set<string>();
  const result: Record<string, unknown> = {};

  // Process each key-value pair
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Validate key is a string
    if (typeof key !== "string") {
      throw new TypeError(`Key at index ${i} must be a string`);
    }

    // Validate key is not empty
    if (key === "") {
      throw new SyntaxError(`Key at index ${i} must not be empty`);
    }

    // Validate key is not a duplicate
    if (seenKeys.has(key)) {
      throw new RangeError(`Duplicate key: '${key}'`);
    }

    // Record the key and add to result
    seenKeys.add(key);
    result[key] = values[i];
  }

  return result;
}

export { zipArraysToRecord };