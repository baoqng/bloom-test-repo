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
    !allowedFields.every((f) => typeof f === 'string')
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

  // Handle empty/absent sorts
  if (sorts === undefined || sorts === null || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined) {
      // Find the actual casing of defaultField in allowedFields
      const matched = allowedFields.find(
        (f) => f.toLowerCase() === defaultField.toLowerCase()
      );
      if (matched !== undefined) {
        return formatField(matched, defaultDirection);
      }
      return formatField(defaultField, defaultDirection);
    }
    return '';
  }

  const sortsArray = sorts as unknown[];
  const parts: string[] = [];

  for (let i = 0; i < sortsArray.length; i++) {
    const entry = sortsArray[i];

    // Must be a plain object
    if (
      typeof entry !== 'object' ||
      entry === null ||
      Array.isArray(entry) ||
      Object.getPrototypeOf(entry) !== Object.prototype
    ) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const obj = entry as Record<string, unknown>;

    // Validate field
    if (typeof obj['field'] !== 'string') {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    const fieldRaw = obj['field'] as string;

    // Case-insensitive match against allowedFields
    const matched = allowedFields.find(
      (f) => f.toLowerCase() === fieldRaw.toLowerCase()
    );
    if (matched === undefined) {
      throw new RangeError(`sort field "${fieldRaw}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction = 'ASC';
    if (obj['direction'] !== undefined) {
      if (typeof obj['direction'] !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = (obj['direction'] as string).toUpperCase();
      if (dirUpper !== 'ASC' && dirUpper !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      direction = dirUpper;
    }

    parts.push(formatField(matched, direction));
  }

  return parts.join(', ');
}

export { buildSortClause };