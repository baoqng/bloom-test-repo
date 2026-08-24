// bloom-deps:

const IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

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

  if (filters === null || typeof filters !== 'object') {
    throw new TypeError('filters must be an object');
  }

  const invalidKeys = Object.keys(filters).filter(
    (key) => !IDENTIFIER_PATTERN.test(key)
  );
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid filter keys: ${invalidKeys.map((k) => `"${k}"`).join(', ')}`);
  }

  const params: unknown[] = [];
  const whereClauses: string[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      whereClauses.push(`${key} IS NULL`);
    } else {
      whereClauses.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  let sql = `SELECT * FROM ${table}`;

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  if (options?.orderBy !== undefined) {
    if (typeof options.orderBy !== 'string' || options.orderBy.length === 0) {
      throw new TypeError('orderBy must be a non-empty string');
    }
    if (!IDENTIFIER_PATTERN.test(options.orderBy)) {
      throw new Error(`Invalid orderBy column: "${options.orderBy}"`);
    }
    const direction = options.direction === 'DESC' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${options.orderBy} ${direction}`;
  }

  if (options?.limit !== undefined) {
    if (typeof options.limit !== 'number' || !Number.isInteger(options.limit) || options.limit < 0) {
      throw new TypeError('limit must be a non-negative integer');
    }
    sql += ` LIMIT ${options.limit}`;
  }

  if (options?.offset !== undefined) {
    if (typeof options.offset !== 'number' || !Number.isInteger(options.offset) || options.offset < 0) {
      throw new TypeError('offset must be a non-negative integer');
    }
    sql += ` OFFSET ${options.offset}`;
  }

  return { sql, params };
}