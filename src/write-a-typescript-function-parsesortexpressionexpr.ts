// bloom-deps:

export function parseSortExpression(
  expr: unknown,
  allowedFields: unknown
): Array<{ field: string; direction: 'asc' | 'desc' }> {
  if (typeof expr !== 'string') {
    throw new TypeError('expr must be a string');
  }

  if (expr.trim().length === 0) {
    throw new RangeError('expr must not be empty');
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    allowedFields.some((el) => typeof el !== 'string')
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  const result: Array<{ field: string; direction: 'asc' | 'desc' }> = [];
  const seenFields = new Set<string>();

  const rawTokens = expr.split(',');
  let hasValidToken = false;

  for (const rawToken of rawTokens) {
    const token = rawToken.trim();

    if (token.length === 0) {
      throw new RangeError(`invalid sort token: ${token}`);
    }

    hasValidToken = true;

    // Count colons explicitly using indexOf
    const firstColon = token.indexOf(':');
    let colonCount = 0;
    let searchIdx = 0;
    while (true) {
      const idx = token.indexOf(':', searchIdx);
      if (idx === -1) break;
      colonCount++;
      searchIdx = idx + 1;
    }

    if (colonCount > 1) {
      throw new RangeError(`invalid sort token: ${token}`);
    }

    let field: string;
    let direction: 'asc' | 'desc';

    if (firstColon === -1) {
      field = token.trim();
      direction = 'asc';
    } else {
      field = token.slice(0, firstColon).trim();
      const dirRaw = token.slice(firstColon + 1).trim().toLowerCase();
      if (dirRaw !== 'asc' && dirRaw !== 'desc') {
        throw new RangeError(`invalid sort direction: ${dirRaw}`);
      }
      direction = dirRaw;
    }

    if (!(allowedFields as string[]).includes(field)) {
      throw new RangeError(`unknown sort field: ${field}`);
    }

    if (seenFields.has(field)) {
      throw new RangeError(`duplicate sort field: ${field}`);
    }

    seenFields.add(field);
    result.push({ field, direction });
  }

  if (!hasValidToken) {
    throw new RangeError('expr must not be empty');
  }

  return result;
}