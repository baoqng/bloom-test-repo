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

  const tableAlias = options?.tableAlias;
  const defaultField = options?.defaultField;
  const defaultDirection = options?.defaultDirection ?? 'ASC';

  function formatField(field: string, direction: string): string {
    const quoted = tableAlias
      ? `${tableAlias}."${field}"`
      : `"${field}"`;
    return `${quoted} ${direction}`;
  }

  // Handle null/undefined/empty sorts
  if (sorts === null || sorts === undefined) {
    if (defaultField !== undefined) {
      return formatField(defaultField, defaultDirection);
    }
    return '';
  }

  // Validate sorts is an array
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  // Handle empty array
  if (sorts.length === 0) {
    if (defaultField !== undefined) {
      return formatField(defaultField, defaultDirection);
    }
    return '';
  }

  const parts: string[] = [];

  for (let i = 0; i < sorts.length; i++) {
    const entry = sorts[i];

    // Must be a plain object
    if (
      entry === null ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      Object.getPrototypeOf(entry) !== Object.prototype
    ) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const record = entry as Record<string, unknown>;

    // Validate field
    if (typeof record['field'] !== 'string' || record['field'].length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const fieldValue = record['field'] as string;

    // Case-insensitive match against allowedFields
    const matchedField = allowedFields.find(
      (f) => f.toLowerCase() === fieldValue.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${fieldValue}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction = 'ASC';
    if ('direction' in record && record['direction'] !== undefined) {
      if (typeof record['direction'] !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = (record['direction'] as string).toUpperCase();
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