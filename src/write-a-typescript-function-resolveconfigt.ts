// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

type SchemaEntry = {
  env: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required?: boolean;
  default?: unknown;
};

type ResolvedConfig<T extends Record<string, SchemaEntry>> = {
  [K in keyof T]: T[K]['type'] extends 'string'
    ? string
    : T[K]['type'] extends 'number'
    ? number
    : T[K]['type'] extends 'boolean'
    ? boolean
    : unknown;
};

function coerceValue(
  rawValue: string,
  type: 'string' | 'number' | 'boolean' | 'json',
  envName: string
): unknown {
  if (type === 'string') {
    return rawValue;
  }

  if (type === 'number') {
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed)) {
      throw new RangeError(
        `Environment variable "${envName}" has value "${rawValue}" which cannot be coerced to a number`
      );
    }
    return parsed;
  }

  if (type === 'boolean') {
    if (rawValue === 'true' || rawValue === '1') {
      return true;
    }
    if (rawValue === 'false' || rawValue === '0') {
      return false;
    }
    throw new RangeError(
      `Environment variable "${envName}" has value "${rawValue}" which cannot be coerced to a boolean. Expected 'true', 'false', '1', or '0'`
    );
  }

  if (type === 'json') {
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      throw new SyntaxError(
        `Environment variable "${envName}" has value "${rawValue}" which is not valid JSON`
      );
    }
  }

  throw new TypeError(`Unknown type "${type}" for environment variable "${envName}"`);
}

export function resolveConfig<
  T extends Record<string, SchemaEntry>
>(schema: T): ResolvedConfig<T> {
  if (schema === null || schema === undefined || typeof schema !== 'object') {
    throw new TypeError('schema must be a non-null object');
  }

  const missingRequired: string[] = [];
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(schema)) {
    const entry = schema[key];

    if (entry === null || entry === undefined || typeof entry !== 'object') {
      throw new TypeError(`Schema entry for key "${key}" must be a non-null object`);
    }

    const envName = entry.env;

    if (typeof envName !== 'string' || envName.length === 0) {
      throw new TypeError(`Schema entry for key "${key}" must have a non-empty string "env" property`);
    }

    const validTypes = ['string', 'number', 'boolean', 'json'];
    if (!validTypes.includes(entry.type)) {
      throw new TypeError(`Schema entry for key "${key}" has invalid type "${entry.type}"`);
    }

    const isRequired = entry.required !== undefined ? entry.required : true;
    const rawValue = process.env[envName];

    if (rawValue === undefined || rawValue === null) {
      if (entry.default !== undefined) {
        result[key] = entry.default;
        continue;
      }

      if (isRequired) {
        missingRequired.push(envName);
        continue;
      }

      result[key] = undefined;
      continue;
    }

    result[key] = coerceValue(rawValue, entry.type, envName);
  }

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(', ')}`
    );
  }

  return result as ResolvedConfig<T>;
}