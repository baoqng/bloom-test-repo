// bloom-deps:

type Operator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like';

const OPERATOR_MAP: Record<Operator, string> = {
  eq: '=',
  ne: '<>',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
  like: 'LIKE',
};

const VALID_OPERATORS = new Set<string>(['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'like']);

export function buildFilterQuery(
  filters: Array<{ field: string; op: Operator; value: unknown }>,
  startIndex: number = 1
): { sql: string; params: unknown[] } {
  if (!Array.isArray(filters)) {
    throw new TypeError('filters must be an array');
  }

  if (filters.length === 0) {
    return { sql: '', params: [] };
  }

  const conditions: string[] = [];
  const params: unknown[] = [];

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];

    if (typeof filter.field !== 'string' || filter.field.length === 0) {
      throw new TypeError(`filter at index ${i}: field must be a non-empty string`);
    }

    if (!VALID_OPERATORS.has(filter.op)) {
      throw new TypeError(`filter at index ${i}: unknown operator "${filter.op}"`);
    }

    const sqlOp = OPERATOR_MAP[filter.op as Operator];
    const paramIndex = startIndex + params.length;
    conditions.push(`${filter.field} ${sqlOp} $${paramIndex}`);
    params.push(filter.value);
  }

  return {
    sql: conditions.join(' AND '),
    params,
  };
}