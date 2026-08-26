// bloom-deps:

export function parseSortExpression(
  expr: unknown,
  allowedFields: unknown
): Array<{ field: string; direction: 'asc' | 'desc' }> {
  if (typeof expr !== 'string') {
    throw new TypeError('expr must be a string');
  }

  if (expr.trim() === '') {
    throw new RangeError('expr must not be empty');
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((el) => typeof el === 'string')
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  const tokens = expr.split(',');
  const result: Array<{ field: string; direction: 'asc' | 'desc' }> = [];
  const seenFields = new Set<string>();

  for (const rawToken of tokens) {
    const token = rawToken.trim();

    if (token === '') {
      throw new RangeError(`invalid sort token: ${token}`);
    }

    const colonCount = (token.match(/:/g) || []).length;
    if (colonCount > 1) {
      throw new RangeError(`invalid sort token: ${token}`);
    }

    let field: string;
    let direction: 'asc' | 'desc';

    if (colonCount === 0) {
      field = token.trim();
      direction = 'asc';
    } else {
      const colonIndex = token.indexOf(':');
      field = token.slice(0, colonIndex).trim();
      const rawDirection = token.slice(colonIndex + 1).trim().toLowerCase();
      if (rawDirection !== 'asc' && rawDirection !== 'desc') {
        throw new RangeError(`invalid sort direction: ${rawDirection}`);
      }
      direction = rawDirection;
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

  return result;
}