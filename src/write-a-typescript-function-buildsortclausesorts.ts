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

  // Validate sorts type
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
  if (sorts === null || sorts === undefined || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined && defaultField !== null && defaultField.length > 0) {
      return formatField(defaultField, defaultDirection);
    }
    return '';
  }

  // sorts is a non-empty array at this point
  const sortArray = sorts as unknown[];
  const parts: string[] = [];

  for (let i = 0; i < sortArray.length; i++) {
    const entry = sortArray[i];

    // Must be a plain object
    if (
      entry === null ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      Object.getPrototypeOf(entry) !== Object.prototype
    ) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const obj = entry as Record<string, unknown>;

    // Validate field
    if (typeof obj['field'] !== 'string' || obj['field'].length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const fieldValue = obj['field'] as string;

    // Case-insensitive match against allowedFields
    const matchedField = allowedFields.find(
      (af) => af.toLowerCase() === fieldValue.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${fieldValue}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction = 'ASC';
    if (obj['direction'] !== undefined) {
      if (typeof obj['direction'] !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = obj['direction'].toUpperCase();
      if (dirUpper !== 'ASC' && dirUpper !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      direction = dirUpper;
    }

    parts.push(formatField(matchedField, direction));
  }

  return parts.join(', ');
}

export { buildSortClause };