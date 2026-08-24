// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function buildSortClause(sorts: unknown, allowedFields: unknown): string {
  // Validate sorts is an array
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  // Validate allowedFields is a non-empty array of non-empty strings
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every(
      (field) => typeof field === 'string' && field.length > 0
    )
  ) {
    throw new TypeError(
      'allowedFields must be a non-empty array of non-empty strings'
    );
  }

  // Return empty string if sorts is empty
  if (sorts.length === 0) {
    return '';
  }

  const seenFields = new Set<string>();
  const orderByParts: string[] = [];

  for (const element of sorts) {
    // Validate element is a plain object
    if (!isPlainObject(element)) {
      throw new TypeError(
        'Each sort element must be a plain object with field and direction'
      );
    }

    // Validate field exists and is a non-empty string
    const field = element.field;
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError('sort element field must be a non-empty string');
    }

    // Validate direction exists and is a string
    const direction = element.direction;
    if (typeof direction !== 'string') {
      throw new TypeError('sort element direction must be a string');
    }

    // Validate direction is one of the allowed values (exact case match only)
    if (!['asc', 'ASC', 'desc', 'DESC'].includes(direction)) {
      throw new RangeError(
        "direction must be 'asc', 'ASC', 'desc', or 'DESC'"
      );
    }

    // Validate field is in allowedFields (case-sensitive)
    if (!allowedFields.includes(field)) {
      throw new RangeError(`field '${field}' is not in allowedFields`);
    }

    // Check for duplicate field values
    if (seenFields.has(field)) {
      throw new RangeError(`duplicate field value: '${field}'`);
    }

    seenFields.add(field);
    const normalizedDirection = direction.toUpperCase();
    orderByParts.push(`"${field}" ${normalizedDirection}`);
  }

  return `ORDER BY ${orderByParts.join(', ')}`;
}

export { buildSortClause, ServiceError };