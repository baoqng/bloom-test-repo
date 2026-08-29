// bloom-deps:

export function buildCacheKey(prefix: unknown, parts: unknown, separator: unknown): string {
  if (typeof prefix !== 'string' || prefix.length === 0) {
    throw new TypeError('prefix must be a non-empty string');
  }

  if (!Array.isArray(parts) || parts.length === 0) {
    throw new TypeError('parts must be a non-empty array');
  }

  if (typeof separator !== 'string' || separator.length === 0) {
    throw new TypeError('separator must be a non-empty string');
  }

  const coercedParts: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (typeof part === 'string') {
      coercedParts.push(part);
    } else if (typeof part === 'number') {
      coercedParts.push(String(part));
    } else if (typeof part === 'boolean') {
      coercedParts.push(String(part));
    } else {
      throw new TypeError(`Cache key part at index ${i} must be string, number, or boolean`);
    }
  }

  const result = prefix + separator + coercedParts.join(separator);

  if (result.length > 512) {
    throw new RangeError('Cache key exceeds 512 characters');
  }

  return result;
}