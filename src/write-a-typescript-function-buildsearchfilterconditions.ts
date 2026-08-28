// bloom-deps:

type Op = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';

const VALID_OPS: Op[] = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in'];

const OP_MAP: Record<Op, string> = {
  eq: '$eq',
  ne: '$ne',
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',
  in: '$in',
};

export function buildSearchFilter(conditions: unknown): Record<string, unknown> {
  if (!Array.isArray(conditions)) {
    throw new TypeError('conditions must be an array');
  }

  const result: Record<string, Record<string, unknown>> = {};

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];

    const field = (condition as Record<string, unknown>)?.field;
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError(`Condition at index ${i}: field must be a non-empty string`);
    }

    const op = (condition as Record<string, unknown>)?.op;
    if (!VALID_OPS.includes(op as Op)) {
      throw new TypeError(`Condition at index ${i}: op must be one of eq, ne, gt, gte, lt, lte, in`);
    }

    const value = (condition as Record<string, unknown>)?.value;
    if (op === 'in' && !Array.isArray(value)) {
      throw new TypeError(`Condition at index ${i}: value for 'in' must be an array`);
    }

    const mongoOp = OP_MAP[op as Op];

    if (result[field] === undefined) {
      result[field] = {};
    }

    result[field][mongoOp] = value;
  }

  return result;
}