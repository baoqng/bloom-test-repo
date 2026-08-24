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
    // Validate key type
    if (typeof key !== 'string') {
      throw new TypeError(`Tag key must be a non-empty string, got: ${String(key)}`);
    }

    // Validate key is non-empty
    if (key.length === 0) {
      throw new RangeError(`Tag key is empty after trimming: "${key}"`);
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
        `Tag value must be a string, number, or boolean, got: ${typeof value} for key "${key}"`
      );
    }

    // Validate number is finite
    if (typeof value === 'number' && !isFinite(value)) {
      throw new RangeError(
        `Tag value must be a finite number, got: ${value} for key "${key}"`
      );
    }

    // Convert value to string
    let stringValue: string;
    if (typeof value === 'boolean') {
      stringValue = value ? 'true' : 'false';
    } else {
      stringValue = String(value);
    }

    result.push(`${key}:${stringValue}`);
  }

  // Sort lexicographically by key
  result.sort((a, b) => {
    const keyA = a.substring(0, a.indexOf(':'));
    const keyB = b.substring(0, b.indexOf(':'));
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
  });

  return result;
}

export { buildMetricTags };