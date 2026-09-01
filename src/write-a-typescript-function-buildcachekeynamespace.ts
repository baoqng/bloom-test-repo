// bloom-deps:

const VALID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function buildCacheKey(namespace: unknown, parts: unknown): string {
  if (typeof namespace !== 'string') {
    throw new TypeError('namespace must be a non-empty string containing only alphanumeric characters, hyphens, and underscores');
  }
  if (namespace.length === 0) {
    throw new TypeError('namespace must be a non-empty string containing only alphanumeric characters, hyphens, and underscores');
  }
  if (!VALID_PATTERN.test(namespace)) {
    throw new TypeError('namespace must be a non-empty string containing only alphanumeric characters, hyphens, and underscores');
  }

  if (!Array.isArray(parts)) {
    throw new TypeError('parts must be a non-empty array of valid strings');
  }
  if (parts.length === 0) {
    throw new TypeError('parts must be a non-empty array of valid strings');
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (typeof part !== 'string') {
      throw new TypeError(`parts[${i}] must be a non-empty string containing only alphanumeric characters, hyphens, and underscores`);
    }
    if (part.length === 0) {
      throw new TypeError(`parts[${i}] must be a non-empty string containing only alphanumeric characters, hyphens, and underscores`);
    }
    if (!VALID_PATTERN.test(part)) {
      throw new TypeError(`parts[${i}] must be a non-empty string containing only alphanumeric characters, hyphens, and underscores`);
    }
  }

  return `${namespace}:${(parts as string[]).join(':')}`;
}