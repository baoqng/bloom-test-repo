// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

type ConditionOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';

interface Condition {
  field: string;
  op: ConditionOperator;
  value: unknown;
}

const VALID_OPS: readonly ConditionOperator[] = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in'];

const OP_TO_MONGO: Record<ConditionOperator, string> = {
  eq: '$eq',
  ne: '$ne',
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',
  in: '$in',
};

function buildSearchFilter(conditions: unknown): Record<string, unknown> {
  // Validate that conditions is an array
  if (!Array.isArray(conditions)) {
    throw new TypeError('conditions must be an array');
  }

  const filter: Record<string, Record<string, unknown>> = {};

  // Process each condition
  for (let index = 0; index < conditions.length; index++) {
    const condition = conditions[index];

    // Validate condition is an object
    if (typeof condition !== 'object' || condition === null) {
      throw new TypeError(`Condition at index ${index}: condition must be an object`);
    }

    const cond = condition as Record<string, unknown>;

    // Validate field
    const field = cond.field;
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError(`Condition at index ${index}: field must be a non-empty string`);
    }

    // Validate op
    const op = cond.op;
    if (typeof op !== 'string' || !VALID_OPS.includes(op as ConditionOperator)) {
      throw new TypeError(
        `Condition at index ${index}: op must be one of ${VALID_OPS.join(', ')}`
      );
    }

    const typedOp = op as ConditionOperator;

    // Validate value for 'in' operator
    if (typedOp === 'in' && !Array.isArray(cond.value)) {
      throw new TypeError(`Condition at index ${index}: value for 'in' must be an array`);
    }

    const value = cond.value;
    const mongoOp = OP_TO_MONGO[typedOp];

    // Initialize field object if not exists
    if (!filter[field]) {
      filter[field] = {};
    }

    // Add or merge the operator and value
    filter[field][mongoOp] = value;
  }

  return filter;
}

export { buildSearchFilter, ServiceError };