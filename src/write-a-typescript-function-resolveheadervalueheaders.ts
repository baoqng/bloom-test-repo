// bloom-deps:

function resolveHeaderValue(headers: unknown, name: unknown): string | undefined {
  // Validate headers: must be a non-null, non-array object
  if (headers === null || typeof headers !== 'object' || Array.isArray(headers)) {
    throw new TypeError('headers must be an object');
  }

  // Validate name: must be a string
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string');
  }

  // Validate name: must not be empty or whitespace-only
  if (!name.trim()) {
    throw new RangeError('name must not be empty');
  }

  // Normalize lookup name
  const normalizedName = name.trim().toLowerCase();

  // Iterate over own enumerable string keys
  for (const key of Object.keys(headers as Record<string, unknown>)) {
    const normalizedKey = key.trim().toLowerCase();
    if (normalizedKey === normalizedName) {
      const value = (headers as Record<string, unknown>)[key];
      if (typeof value === 'string') {
        return value;
      }
      return String(value);
    }
  }

  return undefined;
}

export { resolveHeaderValue };