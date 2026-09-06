// bloom-deps:

export function buildScopeString(scopes: unknown): string {
  // Type check: must be an array
  if (!Array.isArray(scopes)) {
    throw new TypeError("scopes must be an array");
  }

  // Empty check: array must have at least one element
  if (scopes.length === 0) {
    throw new RangeError("scopes must not be empty");
  }

  // Process and validate each scope
  const processedScopes: string[] = [];
  const seenScopes = new Set<string>();

  for (const scope of scopes) {
    // Type check: each element must be a string
    if (typeof scope !== "string") {
      throw new TypeError("each scope must be a non-empty string");
    }

    // Trim the scope
    const trimmedScope = scope.trim();

    // Empty check: after trimming, must not be empty
    if (trimmedScope.length === 0) {
      throw new TypeError("each scope must be a non-empty string");
    }

    // Character validation: only a-z, A-Z, 0-9, colon, and dot allowed
    if (!/^[a-zA-Z0-9:.]+$/.test(trimmedScope)) {
      throw new RangeError(
        "each scope must contain only letters, digits, colons, and dots"
      );
    }

    // Deduplicate using a Set (case-sensitive)
    if (!seenScopes.has(trimmedScope)) {
      seenScopes.add(trimmedScope);
      processedScopes.push(trimmedScope);
    }
  }

  // Sort lexicographically
  processedScopes.sort();

  // Join with single space
  return processedScopes.join(" ");
}