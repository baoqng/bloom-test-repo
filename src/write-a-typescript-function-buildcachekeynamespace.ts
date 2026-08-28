// bloom-deps:

function buildCacheKey(namespace: unknown, parts: unknown): string {
  if (typeof namespace !== 'string' || namespace.trim().length === 0) {
    throw new TypeError('namespace must be a non-empty string');
  }
  const trimmedNamespace = namespace.trim();
  if (!/^[a-zA-Z0-9\-_]+$/.test(trimmedNamespace)) {
    throw new RangeError('namespace must contain only letters, digits, hyphens, and underscores');
  }

  if (!Array.isArray(parts) || parts.length === 0) {
    throw new TypeError('parts must be a non-empty array');
  }

  const convertedParts: string[] = [];

  for (const part of parts) {
    if (typeof part !== 'string' && typeof part !== 'number') {
      throw new TypeError('each part must be a string or number');
    }
    if (typeof part === 'string') {
      if (part.trim().length === 0) {
        throw new RangeError('each part must not be empty');
      }
      convertedParts.push(part.trim());
    } else {
      if (isNaN(part) || !isFinite(part)) {
        throw new RangeError('each part must not be empty');
      }
      convertedParts.push(String(part));
    }
  }

  return trimmedNamespace + ':' + convertedParts.join(':');
}

export { buildCacheKey };