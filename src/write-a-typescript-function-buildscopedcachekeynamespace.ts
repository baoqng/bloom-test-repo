// bloom-deps:

function buildScopedCacheKey(
  namespace: unknown,
  entityType: unknown,
  id: unknown,
  version: unknown
): string {
  // Validate namespace
  if (typeof namespace !== "string" || namespace.length === 0) {
    throw new TypeError("namespace must be a non-empty string");
  }

  // Validate entityType
  if (typeof entityType !== "string" || entityType.length === 0) {
    throw new TypeError("entityType must be a non-empty string");
  }

  // Validate id
  if (typeof id !== "string" || id.length === 0) {
    throw new TypeError("id must be a non-empty string");
  }

  // Validate version
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    throw new TypeError("version must be a non-negative integer");
  }

  // Check for colons in namespace
  if (namespace.indexOf(":") !== -1) {
    throw new RangeError("Cache key component must not contain colons");
  }

  // Check for colons in entityType
  if (entityType.indexOf(":") !== -1) {
    throw new RangeError("Cache key component must not contain colons");
  }

  // Check for colons in id
  if (id.indexOf(":") !== -1) {
    throw new RangeError("Cache key component must not contain colons");
  }

  // Construct and return the cache key
  return `${namespace}:${entityType}:${id}:v${version}`;
}

export { buildScopedCacheKey };