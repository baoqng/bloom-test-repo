// bloom-deps:

export function parseOAuthScopes(input: unknown): string[] {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const tokens = trimmed.split(/\s+/);
  const validCharPattern = /^[\x21-\x7E]+$/;

  for (const token of tokens) {
    if (!validCharPattern.test(token) || token.includes('"') || token.includes('\\')) {
      throw new SyntaxError(`Invalid scope: ${token}`);
    }
  }

  const deduped = Array.from(new Set(tokens));
  deduped.sort();
  return deduped;
}