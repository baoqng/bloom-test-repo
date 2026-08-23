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
    const quotedField = tableAlias
      ? `${tableAlias}."${field}"`
      : `"${field}"`;
    return `${quotedField} ${direction}`;
  }

  // Handle null/undefined/empty sorts
  if (sorts === null || sorts === undefined) {
    if (defaultField !== undefined) {
      // Find matching field in allowedFields (case-insensitive)
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      const resolvedField = matched ?? defaultField;
      return formatField(resolvedField, defaultDirection);
    }
    return '';
  }

  // sorts is provided and not an array
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  // Empty array
  if (sorts.length === 0) {
    if (defaultField !== undefined) {
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      const resolvedField = matched ?? defaultField;
      return formatField(resolvedField, defaultDirection);
    }
    return '';
  }

  // Validate and process each entry
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
      throw new RangeError(
        `sort field "${field}" at index ${i} is not in allowedFields`
      );
    }

    // Validate direction
    let direction = 'ASC';
    if ('direction' in entryObj && entryObj['direction'] !== undefined) {
      const rawDirection = entryObj['direction'];
      if (typeof rawDirection !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const normalizedDirection = rawDirection.toUpperCase();
      if (normalizedDirection !== 'ASC' && normalizedDirection !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      direction = normalizedDirection;
    }

    parts.push(formatField(matchedField, direction));
  }

  return parts.join(', ');
}

export { buildSortClause };