// bloom-deps:

type SchemaDescriptor = {
  type: 'String' | 'Int' | 'Float' | 'Boolean' | 'ID';
  required?: boolean;
};

function isPlainObject(x: unknown): x is Record<string, unknown> {
  if (x === null) return false;
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

export function buildGraphQLVariables(
  schema: unknown,
  inputs: unknown
): Record<string, unknown> {
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }
  if (!isPlainObject(inputs)) {
    throw new TypeError('inputs must be a plain object');
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(schema)) {
    const descriptor = schema[key] as SchemaDescriptor;
    const required = descriptor.required === true;
    const hasKey = Object.prototype.hasOwnProperty.call(inputs, key);
    const value = inputs[key];

    if (required && (!hasKey || value === null || value === undefined)) {
      throw new RangeError(`Required variable ${key} is missing`);
    }

    if (!hasKey || value === null || value === undefined) {
      continue;
    }

    const type = descriptor.type;

    if (type === 'String') {
      result[key] = String(value);
    } else if (type === 'Int') {
      const num = Math.trunc(Number(value));
      if (isNaN(num)) {
        throw new RangeError(`${key} must be a valid integer`);
      }
      result[key] = num;
    } else if (type === 'Float') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new RangeError(`${key} must be a valid number`);
      }
      result[key] = num;
    } else if (type === 'Boolean') {
      result[key] = Boolean(value);
    } else if (type === 'ID') {
      result[key] = String(value);
    }
  }

  return result;
}