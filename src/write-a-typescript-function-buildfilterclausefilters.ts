// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (proto.constructor !== undefined && typeof proto.constructor === 'function' && proto.constructor !== Object) return false;
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

const OP_MAP: Record<string, string> = {
  eq: '=',
  neq: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: 'LIKE',
};

const SUPPORTED_OPS = new Set(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in']);

export function buildFilterClause(filters: unknown): { sql: string; params: unknown[] } {
  if (!Array.isArray(filters)) {
    throw new TypeError('filters must be an array');
  }

  if (filters.length === 0) {
    throw new RangeError('filters must not be empty');
  }

  const clauses: string[] = [];
  const params: unknown[] = [];

  for (const filter of filters) {
    if (filter === null || !isPlainObject(filter)) {
      throw new TypeError('each filter must be an object');
    }

    const f = filter as Record<string, unknown>;

    if (typeof f['field'] !== 'string') {
      throw new TypeError('filter field must be a string');
    }

    const field = f['field'] as string;

    if (field.trim() === '') {
      throw new RangeError('filter field must not be empty');
    }

    if (typeof f['op'] !== 'string') {
      throw new TypeError('filter op must be a string');
    }

    const op = f['op'] as string;

    if (!SUPPORTED_OPS.has(op)) {
      throw new RangeError('unsupported filter op');
    }

    if (f['value'] === undefined) {
      throw new RangeError('filter value required');
    }

    const value = f['value'];

    if (op === 'in') {
      if (!Array.isArray(value) || value.length === 0) {
        throw new TypeError('in filter value must be a non-empty array');
      }
    }

    if (!/^[a-zA-Z0-9_]+$/.test(field)) {
      throw new SyntaxError('invalid field name');
    }

    if (op === 'in') {
      const arr = value as unknown[];
      const placeholders = arr.map(() => '?').join(',');
      clauses.push(`${field} IN (${placeholders})`);
      for (const item of arr) {
        params.push(item);
      }
    } else {
      const opSymbol = OP_MAP[op];
      clauses.push(`${field} ${opSymbol} ?`);
      params.push(value);
    }
  }

  const sql = 'WHERE ' + clauses.join(' AND ');
  return { sql, params };
}