// bloom-deps:

function extractScopeList(scopeString: unknown): string[] {
  if (typeof scopeString !== 'string') {
    throw new TypeError('scopeString must be a string');
  }

  const trimmed = scopeString.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const tokens = trimmed.split(/\s+/);
  const filtered = tokens.filter(token => token.length > 0);

  if (filtered.length === 0) {
    return [];
  }

  const scopePattern = /^[a-z][a-z0-9:_-]*$/;

  for (const scope of filtered) {
    if (!scopePattern.test(scope)) {
      throw new RangeError(`invalid scope: ${scope}`);
    }
  }

  const seen = new Set<string>();
  const deduplicated: string[] = [];

  for (const scope of filtered) {
    if (!seen.has(scope)) {
      seen.add(scope);
      deduplicated.push(scope);
    }
  }

  deduplicated.sort();

  return deduplicated;
}

export { extractScopeList };