// bloom-deps:

function parseOAuthScopes(input: unknown): string[] {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const parts = trimmed.split(/\s+/);
  const validScopePattern = /^[\x21-\x7E]+$/;

  const seen = new Set<string>();

  let anyProcessed = false;

  for (const part of parts) {
    if (part.length === 0) {
      continue;
    }

    anyProcessed = true;

    if (!validScopePattern.test(part) || part.includes('"') || part.includes('\\')) {
      throw new SyntaxError(`Invalid scope: ${part}`);
    }

    seen.add(part);
  }

  if (!anyProcessed) {
    return [];
  }

  const result = Array.from(seen);
  result.sort();
  return result;
}

export { parseOAuthScopes };