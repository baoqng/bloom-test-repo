// bloom-deps:

function buildGraphQLVariables(params: unknown): Record<string, unknown> {
  // Type guard: params must be a plain non-null non-array object
  if (
    params === null ||
    params === undefined ||
    typeof params !== 'object' ||
    Array.isArray(params)
  ) {
    throw new TypeError('params must be a plain non-null non-array object');
  }

  // Ensure it's a plain object (not a class instance)
  if (Object.getPrototypeOf(params) !== Object.prototype && Object.getPrototypeOf(params) !== null) {
    throw new TypeError('params must be a plain non-null non-array object');
  }

  const result: Record<string, unknown> = {};

  // Iterate over all keys in params
  for (const key in params) {
    // Use hasOwnProperty to only process own properties
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      continue;
    }

    // Validate key is a non-empty string
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Variable name must be a non-empty string');
    }

    // Validate key matches GraphQL name pattern: ^[a-zA-Z_][a-zA-Z0-9_]*$
    const graphQLNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!graphQLNamePattern.test(key)) {
      throw new SyntaxError(
        `Invalid variable name '${key}': must match [a-zA-Z_][a-zA-Z0-9_]*`
      );
    }

    // Get the value from params
    const value = (params as Record<string, unknown>)[key];

    // Validate value is not undefined (null is allowed)
    if (value === undefined) {
      throw new TypeError(`Variable '${key}': value must not be undefined`);
    }

    // Add to result object
    result[key] = value;
  }

  return result;
}

export { buildGraphQLVariables };