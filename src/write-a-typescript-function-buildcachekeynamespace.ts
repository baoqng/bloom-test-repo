// bloom-deps:

export function buildCacheKey(namespace: string, ...parts: unknown[]): string {
  // Validate namespace is a non-empty string
  if (typeof namespace !== 'string' || namespace.length === 0) {
    throw new TypeError('namespace must be a non-empty string');
  }

  // Validate namespace does not contain colons
  if (namespace.includes(':')) {
    throw new TypeError('namespace must not contain colons');
  }

  // Validate and process each part
  const processedParts: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Check if part is a string or finite number
    if (typeof part === 'string') {
      // Validate string part is not empty after trimming
      const trimmed = part.trim();
      if (trimmed.length === 0) {
        throw new TypeError(`part at index ${i} must not be empty`);
      }
      processedParts.push(trimmed);
    } else if (typeof part === 'number') {
      // Validate number is finite
      if (!Number.isFinite(part)) {
        throw new TypeError(`part at index ${i} must be a string or number`);
      }
      processedParts.push(String(part));
    } else {
      // Invalid type
      throw new TypeError(`part at index ${i} must be a string or number`);
    }
  }

  // Construct and return the cache key
  if (processedParts.length === 0) {
    return namespace;
  }
  return namespace + ':' + processedParts.join(':');
}