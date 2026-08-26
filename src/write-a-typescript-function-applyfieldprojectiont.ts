// bloom-deps:

function applyFieldProjection<T extends Record<string, unknown>>(source: unknown, fields: unknown): Partial<T> {
  // Validate source
  if (source === null || typeof source !== 'object' || Array.isArray(source)) {
    throw new TypeError('source must be a plain object');
  }

  // Check for class instance (not a plain object)
  if (Object.getPrototypeOf(source) !== Object.prototype) {
    throw new TypeError('source must be a plain object');
  }

  // Validate fields
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

  // Validate each field name
  for (const field of fields as string[]) {
    if (field.trim() === '') {
      throw new RangeError('each field name must be a non-empty string');
    }
  }

  // Build result
  const sourceObj = source as Record<string, unknown>;
  const result: Partial<T> = {};

  for (const field of fields as string[]) {
    if (Object.prototype.hasOwnProperty.call(sourceObj, field)) {
      (result as Record<string, unknown>)[field] = sourceObj[field];
    }
  }

  return result;
}

export { applyFieldProjection };