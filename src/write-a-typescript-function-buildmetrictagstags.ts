// bloom-deps:

function buildMetricTags(tags: unknown): string[] {
  // Validate that tags is a plain object
  if (
    tags === null ||
    typeof tags !== 'object' ||
    Array.isArray(tags) ||
    Object.getPrototypeOf(tags) !== Object.prototype
  ) {
    throw new TypeError('tags must be a plain object');
  }

  const tagObject = tags as Record<string, unknown>;
  const result: string[] = [];

  for (const key of Object.keys(tagObject)) {
    // Validate key type and non-empty
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError(`Tag key must be a non-empty string, got: ${typeof key}`);
    }

    // Validate key is non-empty after trimming
    if (key.trim().length === 0) {
      throw new RangeError(`Tag key is empty after trimming: "${key}"`);
    }

    // Validate key does not contain colon
    if (key.includes(':')) {
      throw new RangeError(`Tag key must not contain a colon: "${key}"`);
    }

    // Validate key does not contain whitespace
    if (/\s/.test(key)) {
      throw new RangeError(`Tag key must not contain whitespace: "${key}"`);
    }

    const value = tagObject[key];

    // Validate value type
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new TypeError(
        `Tag value must be a string, number, or boolean; got ${typeof value} for key "${key}"`
      );
    }

    // Validate number is finite
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new RangeError(`Tag value must be a finite number for key "${key}", got: ${value}`);
    }

    const coercedValue = String(value);
    result.push(`${key}:${coercedValue}`);
  }

  // Sort lexicographically by key (the part before the first colon)
  result.sort((a, b) => {
    const keyA = a.split(':')[0];
    const keyB = b.split(':')[0];
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
  });

  return result;
}

export { buildMetricTags };