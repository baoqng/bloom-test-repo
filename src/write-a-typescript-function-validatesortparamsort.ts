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

function validateSortParam(
  sort: unknown,
  allowedFields: unknown
): { field: string; direction: 'asc' | 'desc' } {
  // Validate sort parameter
  if (typeof sort !== 'string') {
    throw new TypeError('sort must be a non-empty string');
  }

  if (sort.length === 0) {
    throw new TypeError('sort must be a non-empty string');
  }

  // Validate allowedFields parameter
  if (!Array.isArray(allowedFields)) {
    throw new TypeError('allowedFields must be a non-empty array');
  }

  if (allowedFields.length === 0) {
    throw new TypeError('allowedFields must be a non-empty array');
  }

  // Validate all elements in allowedFields are non-empty strings
  for (const field of allowedFields) {
    if (typeof field !== 'string') {
      throw new TypeError(
        'allowedFields must be a non-empty array of non-empty strings'
      );
    }
    if (field.length === 0) {
      throw new TypeError(
        'allowedFields must be a non-empty array of non-empty strings'
      );
    }
  }

  // Parse sort string
  let direction: 'asc' | 'desc' = 'asc';
  let fieldName = sort;

  if (sort.startsWith('-')) {
    direction = 'desc';
    fieldName = sort.slice(1);
  }

  // Validate field name is not empty after stripping '-'
  if (fieldName.length === 0) {
    throw new TypeError('sort field name cannot be empty');
  }

  // Check if field name is in allowedFields
  if (!allowedFields.includes(fieldName)) {
    throw new RangeError(`field "${fieldName}" is not in allowedFields`);
  }

  return { field: fieldName, direction };
}

export { validateSortParam, ServiceError };