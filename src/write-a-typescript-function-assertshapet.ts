// bloom-deps:

function assertShape<T extends Record<string, unknown>>(
  value: unknown,
  requiredKeys: string[]
): asserts value is T {
  // Step 1: Validate value is a non-null object
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Expected a non-null object, but received: ${value === null ? "null" : typeof value}`
    );
  }

  // Step 2: Validate requiredKeys is an array of strings
  if (!Array.isArray(requiredKeys)) {
    throw new TypeError(
      `Expected requiredKeys to be an array, but received: ${typeof requiredKeys}`
    );
  }

  for (const key of requiredKeys) {
    if (typeof key !== "string") {
      throw new TypeError(
        `Expected all elements of requiredKeys to be strings, but found: ${typeof key}`
      );
    }
  }

  // Step 3: Validate no empty string keys
  for (const key of requiredKeys) {
    if (key === "") {
      throw new RangeError("requiredKeys must not contain empty strings");
    }
  }

  // Step 4: Validate all required keys are present as own properties with non-undefined values
  const obj = value as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(obj, key) || obj[key] === undefined) {
      throw new RangeError(`Missing required field: ${key}`);
    }
  }
}

export { assertShape };