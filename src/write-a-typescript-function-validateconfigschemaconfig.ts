// bloom-deps:

function isPlainObject(x: unknown): boolean {
  if (x === null) return false;
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

type SchemaDescriptor = {
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  default?: unknown;
};

export function validateConfigSchema(config: unknown, schema: unknown): string[] {
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  const configObj = config as Record<string, unknown>;
  const schemaObj = schema as Record<string, SchemaDescriptor>;

  const errors: string[] = [];

  for (const key of Object.keys(schemaObj)) {
    const descriptor = schemaObj[key];
    const hasKey = Object.prototype.hasOwnProperty.call(configObj, key);

    if (!hasKey) {
      if (descriptor.required === true) {
        errors.push(`${key} is required`);
      }
    } else {
      const value = configObj[key];
      const expectedType = descriptor.type;

      let typeMatches: boolean;
      if (expectedType === 'array') {
        typeMatches = Array.isArray(value);
      } else {
        typeMatches = typeof value === expectedType;
      }

      if (!typeMatches) {
        errors.push(`${key} must be a ${expectedType}`);
      }
    }
  }

  for (const key of Object.keys(configObj)) {
    if (!Object.prototype.hasOwnProperty.call(schemaObj, key)) {
      errors.push(`Unknown key: ${key}`);
    }
  }

  errors.sort();
  return errors;
}