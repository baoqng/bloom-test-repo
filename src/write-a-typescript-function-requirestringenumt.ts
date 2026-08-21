// bloom-deps:

function requireStringEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fieldName: string
): T {
  // Validate fieldName is a non-empty string
  if (typeof fieldName !== 'string' || fieldName === '') {
    throw new TypeError('fieldName must be a string');
  }

  // Validate allowed is a non-empty array
  if (!Array.isArray(allowed) || allowed.length === 0) {
    throw new TypeError('allowed must be a non-empty array');
  }

  // Validate value is a string
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} must be a string`);
  }

  // Validate value is in the allowed array (case-sensitive)
  if (!allowed.includes(value as T)) {
    throw new TypeError(
      `${fieldName} must be one of: ${allowed.join(', ')}`
    );
  }

  return value as T;
}

export { requireStringEnum };