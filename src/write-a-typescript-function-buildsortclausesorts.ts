// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildSortClause(
  sorts: unknown,
  allowedFields: string[],
  options?: { defaultField?: string; defaultDirection?: 'ASC' | 'DESC'; tableAlias?: string }
): string {
  // Validate allowedFields
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((f) => typeof f === 'string' && f.length > 0)
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  // Validate sorts type if provided
  if (sorts !== undefined && sorts !== null && !Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  const tableAlias = options?.tableAlias;
  const defaultField = options?.defaultField;
  const defaultDirection = options?.defaultDirection ?? 'ASC';

  function formatField(field: string, direction: string): string {
    if (tableAlias) {
      return `${tableAlias}."${field}" ${direction}`;
    }
    return `"${field}" ${direction}`;
  }

  // Handle empty/null/undefined sorts
  if (sorts === undefined || sorts === null || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined && typeof defaultField === 'string' && defaultField.length > 0) {
      return formatField(defaultField, defaultDirection);
    }
    return '';
  }

  // Process sort entries
  const sortArray = sorts as unknown[];
  const parts: string[] = [];

  for (let i = 0; i < sortArray.length; i++) {
    const entry = sortArray[i];

    if (!isPlainObject(entry)) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const field = entry['field'];
    const direction = entry['direction'];

    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    // Case-insensitive match against allowedFields
    const matchedField = allowedFields.find(
      (af) => af.toLowerCase() === field.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${field}" at index ${i} is not in allowedFields`);
    }

    let resolvedDirection: string;
    if (direction === undefined) {
      resolvedDirection = 'ASC';
    } else if (typeof direction === 'string' && direction.toUpperCase() === 'ASC') {
      resolvedDirection = 'ASC';
    } else if (typeof direction === 'string' && direction.toUpperCase() === 'DESC') {
      resolvedDirection = 'DESC';
    } else {
      throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
    }

    parts.push(formatField(matchedField, resolvedDirection));
  }

  return parts.join(', ');
}