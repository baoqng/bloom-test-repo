// bloom-deps:

const IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function validateIdentifier(value: string, context: string): void {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`Invalid identifier for ${context}: "${value}"`);
  }
}

export function buildSearchQuery(
  table: string,
  filters: Record<string, string | number | boolean | null>,
  options?: {
    orderBy?: string;
    direction?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }
): { sql: string; params: unknown[] } {
  if (typeof table !== 'string' || table.length === 0) {
    throw new TypeError('table must be a non-empty string');
  }

  if (!IDENTIFIER_PATTERN.test(table)) {
    throw new Error(`Invalid table name: "${table}"`);
  }

  if (filters === null || typeof filters !== 'object' || Array.isArray(filters)) {
    throw new TypeError('filters must be a plain object');
  }

  const invalidKeys = Object.keys(filters).filter(key => !IDENTIFIER_PATTERN.test(key));
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid filter key(s): ${invalidKeys.map(k => `"${k}"`).join(', ')}`);
  }

  if (options !== undefined && (typeof options !== 'object' || options === null || Array.isArray(options))) {
    throw new TypeError('options must be a plain object');
  }

  if (options?.orderBy !== undefined) {
    if (typeof options.orderBy !== 'string' || options.orderBy.length === 0) {
      throw new TypeError('options.orderBy must be a non-empty string');
    }
    if (!IDENTIFIER_PATTERN.test(options.orderBy)) {
      throw new Error(`Invalid orderBy column: "${options.orderBy}"`);
    }
  }

  if (options?.limit !== undefined) {
    if (typeof options.limit !== 'number' || !isFinite(options.limit) || options.limit < 0) {
      throw new TypeError('options.limit must be a non-negative finite number');
    }
  }

  if (options?.offset !== undefined) {
    if (typeof options.offset !== 'number' || !isFinite(options.offset) || options.offset < 0) {
      throw new TypeError('options.offset must be a non-negative finite number');
    }
  }

  const params: unknown[] = [];
  const conditions: string[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else {
      conditions.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  let sql = `SELECT * FROM ${table}`;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (options?.orderBy !== undefined) {
    const direction = options.direction === 'DESC' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${options.orderBy} ${direction}`;
  }

  if (options?.limit !== undefined) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(options.limit);
    paramIndex++;
  }

  if (options?.offset !== undefined) {
    sql += ` OFFSET $${paramIndex}`;
    params.push(options.offset);
    paramIndex++;
  }

  return { sql, params };
}