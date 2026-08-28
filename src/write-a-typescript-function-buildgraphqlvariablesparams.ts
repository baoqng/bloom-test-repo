// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildGraphQLVariables(params: unknown): Record<string, unknown> {
  // Validate that params is a plain non-null non-array object
  if (
    params === null ||
    typeof params !== 'object' ||
    Array.isArray(params) ||
    !isPlainObject(params)
  ) {
    throw new TypeError('params must be a plain non-null non-array object');
  }

  const graphqlNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(params as Record<string, unknown>)) {
    // Validate key is a non-empty string
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Variable name must be a non-empty string');
    }

    // Validate key matches GraphQL name pattern
    if (!graphqlNamePattern.test(key)) {
      throw new SyntaxError(`Invalid variable name '${key}': must match [a-zA-Z_][a-zA-Z0-9_]*`);
    }

    const value = (params as Record<string, unknown>)[key];

    // Validate value is not undefined
    if (value === undefined) {
      throw new TypeError(`Variable '${key}': value must not be undefined`);
    }

    result[key] = value;
  }

  return result;
}