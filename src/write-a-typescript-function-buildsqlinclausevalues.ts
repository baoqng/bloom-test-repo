// bloom-deps:

function buildSqlInClause(values: unknown[], startIndex: number): { sql: string; params: unknown[] } {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }

  if (values.length === 0) {
    throw new RangeError('values must not be empty');
  }

  if (!Number.isInteger(startIndex) || !Number.isFinite(startIndex) || startIndex < 1) {
    throw new RangeError('startIndex must be a positive integer');
  }

  const placeholders = values.map((_, i) => `$${startIndex + i}`).join(', ');
  const sql = `(${placeholders})`;
  const params = [...values];

  return { sql, params };
}

export { buildSqlInClause };