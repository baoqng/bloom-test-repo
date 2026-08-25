// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function isPlainObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function getActualType(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}

const SUPPORTED_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'array',
  'object',
  'null',
]);

function validateShapeContract(obj: unknown, schema: unknown): true {
  // Validate schema is a plain object
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  // Validate obj is a plain object
  if (!isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object');
  }

  const schemaObj = schema as Record<string, unknown>;
  const objToValidate = obj as Record<string, unknown>;

  // Validate all schema values are supported type strings
  for (const [key, typeValue] of Object.entries(schemaObj)) {
    if (typeof typeValue !== 'string' || !SUPPORTED_TYPES.has(typeValue)) {
      throw new TypeError(
        `schema key '${key}': unsupported type '${typeValue}'`
      );
    }
  }

  // Validate each schema key exists in obj with correct type
  for (const [key, expectedType] of Object.entries(schemaObj)) {
    const expectedTypeStr = expectedType as string;

    if (!(key in objToValidate)) {
      throw new TypeError(`field '${key}': required but missing`);
    }

    const value = objToValidate[key];
    let actualType: string;

    if (expectedTypeStr === 'array') {
      actualType = Array.isArray(value) ? 'array' : getActualType(value);
    } else if (expectedTypeStr === 'null') {
      actualType = value === null ? 'null' : getActualType(value);
    } else {
      actualType = getActualType(value);
    }

    if (actualType !== expectedTypeStr) {
      throw new TypeError(
        `field '${key}': expected ${expectedTypeStr}, got ${actualType}`
      );
    }
  }

  return true;
}

export { validateShapeContract, ServiceError };