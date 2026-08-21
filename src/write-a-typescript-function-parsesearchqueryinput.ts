// bloom-deps:

export function parseSearchQuery(
  input: unknown,
  allowedFields: string[]
): { terms: string[]; filters: Array<{ field: string; value: string }>; raw: string } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((f) => typeof f === 'string')
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { terms: [], filters: [], raw: '' };
  }

  const tokens = trimmed.split(/\s+/);
  const terms: string[] = [];
  const filters: Array<{ field: string; value: string }> = [];

  const allowedLower = allowedFields.map((f) => f.toLowerCase());

  for (const token of tokens) {
    const match = token.match(/^(\w+):(.+)$/);
    if (match) {
      const fieldLower = match[1].toLowerCase();
      const value = match[2];
      if (allowedLower.includes(fieldLower)) {
        filters.push({ field: fieldLower, value });
      } else {
        terms.push(token);
      }
    } else {
      terms.push(token);
    }
  }

  return { terms, filters, raw: trimmed };
}