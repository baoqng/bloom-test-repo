// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildSortClause(
  sorts: unknown,
  allowedFields: string[],
  options?: {
    defaultField?: string;
    defaultDirection?: 'ASC' | 'DESC';
    tableAlias?: string;
  }
): string {
  // Validate allowedFields
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((f) => typeof f === 'string' && f.length > 0)
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  // Validate sorts type
  if (sorts !== undefined && sorts !== null && !Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  const tableAlias = options?.tableAlias;
  const defaultField = options?.defaultField;
  const defaultDirection = options?.defaultDirection ?? 'ASC';

  function formatField(field: string, direction: string): string {
    const quotedField = `"${field}"`;
    const prefixed = tableAlias ? `${tableAlias}.${quotedField}` : quotedField;
    return `${prefixed} ${direction}`;
  }

  // Handle null/undefined/empty sorts
  if (sorts === undefined || sorts === null || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined) {
      // Find the canonical casing from allowedFields
      const matchedField = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      const resolvedField = matchedField ?? defaultField;
      return formatField(resolvedField, defaultDirection);
    }
    return '';
  }

  // sorts is a non-empty array
  const sortsArray = sorts as unknown[];
  const parts: string[] = [];

  for (let i = 0; i < sortsArray.length; i++) {
    const entry = sortsArray[i];

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
      (f) => f.toLowerCase() === field.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${field}" at index ${i} is not in allowedFields`);
    }

    let resolvedDirection: string = 'ASC';

    if (direction !== undefined) {
      if (typeof direction !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const upperDirection = direction.toUpperCase();
      if (upperDirection !== 'ASC' && upperDirection !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      resolvedDirection = upperDirection;
    }

    parts.push(formatField(matchedField, resolvedDirection));
  }

  return parts.join(', ');
}