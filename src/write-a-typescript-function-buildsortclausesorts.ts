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

  // Validate sorts type if provided
  if (sorts !== undefined && sorts !== null && !Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  const tableAlias = options?.tableAlias;
  const defaultField = options?.defaultField;
  const defaultDirection = options?.defaultDirection ?? 'ASC';

  function formatField(field: string, direction: string): string {
    if (tableAlias) {
      return `${tableAlias}"${field}" ${direction}`;
    }
    return `"${field}" ${direction}`;
  }

  // Handle empty/null/undefined sorts
  if (sorts === undefined || sorts === null || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined) {
      // Find the actual cased field from allowedFields
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      const resolvedField = matched ?? defaultField;
      return formatField(resolvedField, defaultDirection);
    }
    return '';
  }

  // sorts is a non-empty array at this point
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

    const entryObj = entry as Record<string, unknown>;

    // Validate field
    if (typeof entryObj['field'] !== 'string' || entryObj['field'].length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const rawField = entryObj['field'] as string;

    // Case-insensitive match against allowedFields
    const matchedField = allowedFields.find(
      (f) => f.toLowerCase() === rawField.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${rawField}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction: string = 'ASC';
    if (entryObj['direction'] !== undefined) {
      if (typeof entryObj['direction'] !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = (entryObj['direction'] as string).toUpperCase();
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