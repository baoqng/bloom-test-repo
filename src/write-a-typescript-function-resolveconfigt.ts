// bloom-deps:

function requireEnv(name: string): string | undefined {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new TypeError(`Invalid env var name: must be a non-empty string`);
  }
  const val = process.env[name];
  return val;
}

function coerceValue(
  rawValue: string,
  type: 'string' | 'number' | 'boolean' | 'json',
  envName: string
): unknown {
  if (type === 'string') {
    return rawValue;
  } else if (type === 'number') {
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed)) {
      throw new RangeError(
        `Env var '${envName}' could not be coerced to number: '${rawValue}' results in NaN`
      );
    }
    return parsed;
  } else if (type === 'boolean') {
    if (rawValue === 'true' || rawValue === '1') {
      return true;
    } else if (rawValue === 'false' || rawValue === '0') {
      return false;
    } else {
      throw new RangeError(
        `Env var '${envName}' could not be coerced to boolean: '${rawValue}' is not 'true', '1', 'false', or '0'`
      );
    }
  } else if (type === 'json') {
    try {
      return JSON.parse(rawValue);
    } catch (e) {
      throw new SyntaxError(
        `Env var '${envName}' contains invalid JSON: ${e}`
      );
    }
  } else {
    throw new TypeError(`Unknown type: ${type}`);
  }
}

type SchemaField = {
  env: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required?: boolean;
  default?: unknown;
};

type ResolvedConfig<T extends Record<string, SchemaField>> = {
  [K in keyof T]: T[K]['type'] extends 'string'
    ? string
    : T[K]['type'] extends 'number'
    ? number
    : T[K]['type'] extends 'boolean'
    ? boolean
    : unknown;
};

export function resolveConfig<
  T extends Record<string, SchemaField>
>(schema: T): ResolvedConfig<T> {
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    throw new TypeError('schema must be a non-null, non-array object');
  }

  const missingRequired: string[] = [];
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(schema)) {
    const field = schema[key];

    if (
      typeof field !== 'object' ||
      field === null ||
      Array.isArray(field)
    ) {
      throw new TypeError(`Schema field '${key}' must be a non-null object`);
    }

    if (typeof field.env !== 'string' || field.env.trim().length === 0) {
      throw new TypeError(
        `Schema field '${key}' must have a non-empty string 'env' property`
      );
    }

    const validTypes = ['string', 'number', 'boolean', 'json'];
    if (!validTypes.includes(field.type)) {
      throw new TypeError(
        `Schema field '${key}' has invalid type '${field.type}'; must be one of: string, number, boolean, json`
      );
    }

    const isRequired = field.required !== undefined ? field.required : true;
    const rawValue = requireEnv(field.env);

    if (rawValue === undefined || rawValue === '') {
      if ('default' in field && field.default !== undefined) {
        result[key] = field.default;
      } else if (isRequired) {
        missingRequired.push(field.env);
      } else {
        result[key] = undefined;
      }
    } else {
      result[key] = coerceValue(rawValue, field.type, field.env);
    }
  }

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(', ')}`
    );
  }

  return result as ResolvedConfig<T>;
}