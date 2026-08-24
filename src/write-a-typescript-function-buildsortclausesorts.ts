// bloom-deps:

function buildSortClause(sorts: unknown, allowedFields: unknown): string {
  // Validate allowedFields: must be a non-empty array of non-empty strings
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every(
      (f) => typeof f === 'string' && f.length > 0
    )
  ) {
    throw new TypeError('allowedFields must be a non-empty array of non-empty strings');
  }

  // Validate sorts: must be an array
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  // Return empty string for empty sorts array
  if (sorts.length === 0) {
    return '';
  }

  const validDirections = new Set(['asc', 'ASC', 'desc', 'DESC']);
  const seenFields = new Set<string>();
  const clauses: string[] = [];

  for (let i = 0; i < sorts.length; i++) {
    const element = sorts[i];

    // Each element must be a plain object (not null, not array, not class instance)
    if (
      element === null ||
      typeof element !== 'object' ||
      Array.isArray(element) ||
      Object.getPrototypeOf(element) !== Object.prototype
    ) {
      throw new TypeError(`sorts[${i}] must be a plain object`);
    }

    const obj = element as Record<string, unknown>;

    // Validate field: must be a non-empty string
    if (typeof obj['field'] !== 'string' || obj['field'].length === 0) {
      throw new TypeError(`sorts[${i}].field must be a non-empty string`);
    }

    // Validate direction: must be a string
    if (typeof obj['direction'] !== 'string') {
      throw new TypeError(`sorts[${i}].direction must be a string`);
    }

    const field = obj['field'] as string;
    const direction = obj['direction'] as string;

    // Validate direction value
    if (!validDirections.has(direction)) {
      throw new RangeError(
        `sorts[${i}].direction must be one of 'asc', 'ASC', 'desc', 'DESC'; got '${direction}'`
      );
    }

    // Validate field is in allowedFields (case-sensitive)
    if (!(allowedFields as string[]).includes(field)) {
      throw new RangeError(
        `sorts[${i}].field '${field}' is not in allowedFields`
      );
    }

    // Check for duplicate fields
    if (seenFields.has(field)) {
      throw new RangeError(`sorts contains duplicate field value '${field}'`);
    }
    seenFields.add(field);

    // Normalize direction to uppercase
    const normalizedDirection = direction.toUpperCase();

    clauses.push(`"${field}" ${normalizedDirection}`);
  }

  return 'ORDER BY ' + clauses.join(', ');
}

export { buildSortClause };