// bloom-deps:

function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (val === null || typeof val !== 'object') return false;
  if (Array.isArray(val)) return false;
  // Walk the full prototype chain: must be Object.prototype or null
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}

const SUPPORTED_TYPES = new Set(['string', 'number', 'boolean', 'array', 'object', 'null']);

function getTaxonomyType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export function validateShapeContract(obj: unknown, schema: unknown): true {
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  if (!isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object');
  }

  // Validate all schema values first
  for (const k of Object.keys(schema)) {
    const typeVal = schema[k];
    if (!SUPPORTED_TYPES.has(typeVal as string)) {
      throw new TypeError(`schema key '${k}': unsupported type '${typeVal}'`);
    }
  }

  // Validate obj fields against schema
  for (const k of Object.keys(schema)) {
    const expectedType = schema[k] as string;

    if (!(k in obj)) {
      throw new TypeError(`field '${k}': required but missing`);
    }

    const value = obj[k];
    const actualType = getTaxonomyType(value);

    if (actualType !== expectedType) {
      throw new TypeError(`field '${k}': expected ${expectedType}, got ${actualType}`);
    }
  }

  return true;
}