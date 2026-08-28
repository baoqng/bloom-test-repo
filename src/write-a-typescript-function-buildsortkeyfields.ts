// bloom-deps:

export function buildSortKey(fields: unknown): string {
  if (!Array.isArray(fields)) {
    throw new TypeError('fields must be an Array');
  }

  if (fields.length === 0) {
    throw new RangeError('fields must not be empty');
  }

  const parts: string[] = [];

  for (let i = 0; i < fields.length; i++) {
    const element = fields[i];

    if (typeof element !== 'string' && typeof element !== 'number' && typeof element !== 'boolean') {
      throw new TypeError(`element at index ${i} must be a string, number, or boolean`);
    }

    if (typeof element === 'number') {
      if (!isFinite(element)) {
        throw new RangeError(`number element at index ${i} must be finite`);
      }
      parts.push(String(element));
    } else if (typeof element === 'boolean') {
      parts.push(element ? 'true' : 'false');
    } else {
      // string
      if (element.includes('\0')) {
        throw new RangeError(`string element at index ${i} must not contain a null byte`);
      }
      parts.push(element);
    }
  }

  return parts.join('\0');
}