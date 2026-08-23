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
      ? `${tableAlias}"."${field}"`
      : `"${field}"`;
    // Reconstruct properly: alias."field" or "field"
    const fieldExpr = tableAlias
      ? `${tableAlias}."${field}"`
      : `"${field}"`;
    return `${fieldExpr} ${direction}`;
  }

  // Handle null/undefined sorts
  if (sorts === null || sorts === undefined) {
    if (defaultField !== undefined) {
      // Validate defaultField is in allowedFields
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      if (matched) {
        return formatField(matched, defaultDirection);
      }
    }
    return '';
  }

  // Validate sorts is an array
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  // Handle empty sorts array
  if (sorts.length === 0) {
    if (defaultField !== undefined) {
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      if (matched) {
        return formatField(matched, defaultDirection);
      }
    }
    return '';
  }

  // Process each sort entry
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

    const entryObj = entry as Record<string, unknown>;

    // Validate field
    const field = entryObj['field'];
    if (typeof field !== 'string' || field.length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    // Check field is in allowedFields (case-insensitive)
    const matchedField = allowedFields.find(
      (f) => f.toLowerCase() === field.toLowerCase()
    );
    if (matchedField === undefined) {
      throw new RangeError(`sort field "${field}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction = 'ASC';
    if ('direction' in entryObj && entryObj['direction'] !== undefined) {
      const dir = entryObj['direction'];
      if (typeof dir !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = dir.toUpperCase();
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