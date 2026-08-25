// bloom-deps:

function buildGraphQLVariables(params: unknown): Record<string, unknown> {
  if (
    typeof params !== 'object' ||
    params === null ||
    Array.isArray(params)
  ) {
    throw new TypeError('params must be a plain non-null non-array object');
  }

  const graphqlNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(params as Record<string, unknown>)) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Variable name must be a non-empty string');
    }

    if (!graphqlNamePattern.test(key)) {
      throw new SyntaxError(
        `Invalid variable name '${key}': must match [a-zA-Z_][a-zA-Z0-9_]*`
      );
    }

    const value = (params as Record<string, unknown>)[key];

    if (value === undefined) {
      throw new TypeError(`Variable '${key}': value must not be undefined`);
    }

    result[key] = value;
  }

  return result;
}

export { buildGraphQLVariables };