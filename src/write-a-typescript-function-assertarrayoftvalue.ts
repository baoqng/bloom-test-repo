// bloom-deps:

function assertArrayOf<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T,
  fieldName: string
): T[] {
  if (typeof fieldName !== 'string') {
    throw new TypeError('fieldName must be a string');
  }

  if (typeof itemGuard !== 'function') {
    throw new TypeError('itemGuard must be a function');
  }

  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty array`);
  }

  for (let i = 0; i < value.length; i++) {
    if (!itemGuard(value[i])) {
      throw new TypeError(`${fieldName}[${i}] failed type check`);
    }
  }

  return value as T[];
}

export { assertArrayOf };