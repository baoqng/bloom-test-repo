// bloom-deps:

export function validateScopeList(scopes: unknown, allowedScopes: unknown): string[] {
  // Validate scopes parameter
  if (typeof scopes !== 'string') {
    throw new TypeError('scopes must be a string');
  }

  // Validate allowedScopes parameter
  if (!Array.isArray(allowedScopes)) {
    throw new TypeError('allowedScopes must be a non-empty array of non-empty strings');
  }

  if (allowedScopes.length === 0) {
    throw new TypeError('allowedScopes must be a non-empty array of non-empty strings');
  }

  for (const item of allowedScopes) {
    if (typeof item !== 'string') {
      throw new TypeError('allowedScopes must be a non-empty array of non-empty strings');
    }
    if (item.length === 0) {
      throw new TypeError('allowedScopes must be a non-empty array of non-empty strings');
    }
  }

  // Handle empty scopes string
  if (scopes === '') {
    return [];
  }

  // Split on one or more ASCII space characters
  const tokens = scopes.split(/ +/);

  const tokenPattern = /^[a-zA-Z0-9:_\-\/]+$/;
  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of tokens) {
    // Skip empty tokens that might result from leading/trailing spaces
    if (token === '') {
      continue;
    }

    // Validate token format
    if (!tokenPattern.test(token)) {
      throw new SyntaxError(`Invalid scope token: "${token}"`);
    }

    // Validate token is in allowedScopes (case-sensitive)
    if (!(allowedScopes as string[]).includes(token)) {
      throw new RangeError(`Scope token "${token}" is not in the allowed scopes list`);
    }

    // Deduplicate, keeping first occurrence
    if (!seen.has(token)) {
      seen.add(token);
      result.push(token);
    }
  }

  return result;
}