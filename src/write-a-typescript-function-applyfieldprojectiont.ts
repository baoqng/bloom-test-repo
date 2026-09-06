// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function applyFieldProjection<T extends Record<string, unknown>>(
  source: unknown,
  fields: unknown
): Partial<T> {
  if (!isPlainObject(source)) {
    throw new TypeError('source must be a plain object');
  }

  if (!Array.isArray(fields)) {
    throw new TypeError('fields must be a non-empty array of strings');
  }

  if (fields.length === 0) {
    throw new TypeError('fields must be a non-empty array of strings');
  }

  for (const field of fields) {
    if (typeof field !== 'string') {
      throw new TypeError('fields must be a non-empty array of strings');
    }
  }

  for (const field of fields as string[]) {
    if (field === '' || field.trimStart() === '' || field.trim() === '') {
      throw new RangeError('each field name must be a non-empty string');
    }
  }

  const sourceObj = source as Record<string, unknown>;
  const result: Partial<T> = {};

  for (const field of fields as string[]) {
    if (Object.prototype.hasOwnProperty.call(sourceObj, field)) {
      (result as Record<string, unknown>)[field] = sourceObj[field];
    }
  }

  return result;
}