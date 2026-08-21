// bloom-deps:

function buildCacheKey(namespace: string, ...parts: unknown[]): string {
  if (typeof namespace !== 'string' || namespace === '') {
    throw new TypeError('namespace must be a non-empty string');
  }

  if (namespace.includes(':')) {
    throw new TypeError('namespace must not contain colons');
  }

  const convertedParts: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (typeof part === 'string') {
      if (part.trim() === '') {
        throw new TypeError(`part at index ${i} must not be empty`);
      }
      convertedParts.push(part);
    } else if (typeof part === 'number' && Number.isFinite(part)) {
      convertedParts.push(String(part));
    } else {
      throw new TypeError(`part at index ${i} must be a string or number`);
    }
  }

  return namespace + ':' + convertedParts.join(':');
}

export { buildCacheKey };