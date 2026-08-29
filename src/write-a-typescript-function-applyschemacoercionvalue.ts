// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export function applySchemaCoercion(value: unknown, schema: unknown): unknown {
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object with a type field');
  }

  const schemaObj = schema as Record<string, unknown>;
  const type = schemaObj['type'];

  if (typeof type !== 'string' || type.length === 0) {
    throw new TypeError('schema must be a plain object with a type field');
  }

  switch (type) {
    case 'string': {
      return String(value);
    }
    case 'number': {
      const result = Number(value);
      if (Number.isNaN(result)) {
        throw new RangeError('Cannot coerce to number');
      }
      return result;
    }
    case 'boolean': {
      if (typeof value === 'boolean') {
        return value;
      }
      if (value === 'true' || value === '1' || value === 'yes') {
        return true;
      }
      if (value === 'false' || value === '0' || value === 'no') {
        return false;
      }
      throw new TypeError('Cannot coerce to boolean');
    }
    case 'integer': {
      const result = Number(value);
      if (Number.isNaN(result)) {
        throw new RangeError('Cannot coerce to number');
      }
      return Math.trunc(result);
    }
    case 'array': {
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    }
    default: {
      throw new TypeError(`Unsupported schema type: ${type}`);
    }
  }
}