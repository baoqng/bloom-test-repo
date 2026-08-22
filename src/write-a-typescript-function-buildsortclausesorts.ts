// bloom-deps:

function buildSortClause(
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

  // Validate sorts type if provided (not null/undefined)
  if (sorts !== null && sorts !== undefined && !Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  const tableAlias = options?.tableAlias;
  const defaultField = options?.defaultField;
  const defaultDirection = options?.defaultDirection ?? 'ASC';

  const formatField = (field: string, direction: string): string => {
    if (tableAlias) {
      return `${tableAlias}."${field}" ${direction}`;
    }
    return `"${field}" ${direction}`;
  };

  // Handle empty/null/undefined sorts
  if (sorts === null || sorts === undefined || (Array.isArray(sorts) && (sorts as unknown[]).length === 0)) {
    if (defaultField !== undefined) {
      // Find the canonical field name (case-insensitive match)
      const canonicalField = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      if (canonicalField !== undefined) {
        return formatField(canonicalField, defaultDirection);
      }
      // If defaultField not in allowedFields, return empty
      return '';
    }
    return '';
  }

  const sortsArray = sorts as unknown[];

  const parts: string[] = [];

  for (let i = 0; i < sortsArray.length; i++) {
    const entry = sortsArray[i];

    // Check plain object
    if (
      entry === null ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      Object.getPrototypeOf(entry) !== Object.prototype
    ) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const obj = entry as Record<string, unknown>;

    // Validate field property
    const field = obj['field'];
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    // Case-insensitive match against allowedFields
    const canonicalField = allowedFields.find(
      (f) => f.toLowerCase() === field.toLowerCase()
    );
    if (canonicalField === undefined) {
      throw new RangeError(`sort field "${field}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction = 'ASC';
    if ('direction' in obj && obj['direction'] !== undefined) {
      const dir = obj['direction'];
      if (typeof dir !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = dir.toUpperCase();
      if (dirUpper !== 'ASC' && dirUpper !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      direction = dirUpper;
    }

    parts.push(formatField(canonicalField, direction));
  }

  return parts.join(', ');
}

export { buildSortClause };