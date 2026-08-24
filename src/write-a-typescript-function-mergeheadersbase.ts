// bloom-deps:

function isPlainObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function mergeHeaders(
  base: unknown,
  overrides: unknown
): Record<string, string> {
  // Input validation guard: check base
  if (!isPlainObject(base)) {
    throw new TypeError('base must be a plain non-null object');
  }

  // Input validation guard: check overrides
  if (!isPlainObject(overrides)) {
    throw new TypeError('overrides must be a plain non-null object');
  }

  // Validate all values in base are strings
  for (const key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      const value = (base as Record<string, unknown>)[key];
      if (typeof value !== 'string') {
        throw new TypeError(
          `base value for key "${key}" must be a string, got ${typeof value}`
        );
      }
    }
  }

  // Validate all values in overrides are strings
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const value = (overrides as Record<string, unknown>)[key];
      if (typeof value !== 'string') {
        throw new TypeError(
          `overrides value for key "${key}" must be a string, got ${typeof value}`
        );
      }
    }
  }

  // Merge headers: base first, then overrides (with lowercase normalization)
  const result: Record<string, string> = {};

  // Add all base headers with lowercase normalization
  for (const key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      const lowerKey = key.toLowerCase();
      result[lowerKey] = (base as Record<string, string>)[key];
    }
  }

  // Add all override headers with lowercase normalization (wins on duplicate)
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const lowerKey = key.toLowerCase();
      result[lowerKey] = (overrides as Record<string, string>)[key];
    }
  }

  return result;
}

export { mergeHeaders };