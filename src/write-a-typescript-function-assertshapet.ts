// bloom-deps:

function assertShape<T extends Record<string, unknown>>(
  value: unknown,
  requiredKeys: string[]
): asserts value is T {
  // Check value is a non-null object
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      "value must be a non-null object"
    );
  }

  // Check requiredKeys is an array of strings
  if (!Array.isArray(requiredKeys)) {
    throw new TypeError("requiredKeys must be an array of strings");
  }

  for (const key of requiredKeys) {
    if (typeof key !== "string") {
      throw new TypeError("requiredKeys must be an array of strings");
    }
  }

  // Check for empty string keys
  for (const key of requiredKeys) {
    if (key === "") {
      throw new RangeError("requiredKeys must not contain empty strings");
    }
  }

  // Check all required keys are present as own properties with non-undefined values
  const obj = value as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(obj, key) || obj[key] === undefined) {
      throw new RangeError(`Missing required field: ${key}`);
    }
  }
}

export { assertShape };