// bloom-deps:

function buildSortDescriptor(sort: unknown): Array<{ field: string; direction: 'asc' | 'desc' }> {
  if (typeof sort !== 'string') {
    throw new TypeError('sort must be a string');
  }

  if (sort.trim().length === 0) {
    throw new RangeError('sort must not be empty');
  }

  const tokens = sort.split(',');
  const result: Array<{ field: string; direction: 'asc' | 'desc' }> = [];

  for (const token of tokens) {
    const trimmed = token.trim();

    let direction: 'asc' | 'desc';
    let field: string;

    if (trimmed.startsWith('-')) {
      direction = 'desc';
      field = trimmed.slice(1);
    } else if (trimmed.startsWith('+')) {
      direction = 'asc';
      field = trimmed.slice(1);
    } else {
      direction = 'asc';
      field = trimmed;
    }

    if (field.trim().length === 0) {
      throw new RangeError('sort field must not be empty');
    }

    if (!/^[A-Za-z0-9_.]+$/.test(field)) {
      throw new RangeError('sort field contains invalid characters');
    }

    result.push({ field, direction });
  }

  return result;
}

export { buildSortDescriptor };