// bloom-deps:

function validateScopeList(scopes: unknown, allowedScopes: unknown): string[] {
  // Validate scopes parameter
  if (typeof scopes !== 'string') {
    throw new TypeError('scopes must be a string');
  }

  // Empty string is valid - return empty array
  if (scopes === '') {
    return [];
  }

  // Validate allowedScopes parameter
  if (!Array.isArray(allowedScopes)) {
    throw new TypeError('allowedScopes must be an array');
  }

  // allowedScopes must not be empty
  if (allowedScopes.length === 0) {
    throw new TypeError('allowedScopes must be a non-empty array');
  }

  // Validate that all elements in allowedScopes are non-empty strings
  for (const scope of allowedScopes) {
    if (typeof scope !== 'string') {
      throw new TypeError('allowedScopes must contain only strings');
    }
    if (scope === '') {
      throw new TypeError('allowedScopes must not contain empty strings');
    }
  }

  // Convert allowedScopes to a Set for O(1) lookup
  const allowedScopesSet = new Set(allowedScopes as string[]);

  // Split scopes on one or more ASCII space characters
  const scopeTokens = scopes.split(/\s+/);

  // Track seen tokens for deduplication (keep first occurrence)
  const seenTokens = new Set<string>();
  const result: string[] = [];

  for (const token of scopeTokens) {
    // Validate token format: alphanumeric plus colon, underscore, hyphen, forward-slash
    if (!/^[a-zA-Z0-9:_\-\/]+$/.test(token)) {
      throw new SyntaxError(`Invalid scope token format: "${token}"`);
    }

    // Check if token is in allowedScopes (case-sensitive)
    if (!allowedScopesSet.has(token)) {
      throw new RangeError(`Scope token "${token}" is not in allowed scopes`);
    }

    // Deduplicate: only add if not seen before
    if (!seenTokens.has(token)) {
      seenTokens.add(token);
      result.push(token);
    }
  }

  return result;
}

export { validateScopeList };