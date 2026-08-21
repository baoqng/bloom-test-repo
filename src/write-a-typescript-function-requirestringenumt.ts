// bloom-deps:

function requireStringEnum<T extends string>(value: unknown, allowed: readonly T[], fieldName: string): T {
  if (typeof fieldName !== 'string') {
    throw new TypeError('fieldName must be a string');
  }

  if (!Array.isArray(allowed) || allowed.length === 0) {
    throw new TypeError('allowed must be a non-empty array');
  }

  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} must be a string`);
  }

  if (!(allowed as readonly string[]).includes(value)) {
    throw new TypeError(`${fieldName} must be one of: ${allowed.join(', ')}`);
  }

  return value as T;
}

export { requireStringEnum };