// bloom-deps:

export function toBoolean(value: unknown): boolean {
  if (value === null || value === undefined) {
    throw new TypeError('value is required');
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true' || trimmed === '1' || trimmed === 'yes') {
      return true;
    }
    if (trimmed === 'false' || trimmed === '0' || trimmed === 'no') {
      return false;
    }
    throw new TypeError('cannot convert string to boolean: ' + value);
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  throw new TypeError('cannot convert ' + typeof value + ' to boolean');
}