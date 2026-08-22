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

  function quoteField(field: string): string {
    if (tableAlias) {
      return `${tableAlias}."${field}"`;
    }
    return `"${field}"`;
  }

  // Handle empty/null/undefined sorts
  if (sorts === null || sorts === undefined || (Array.isArray(sorts) && sorts.length === 0)) {
    if (defaultField !== undefined && defaultField !== null && defaultField !== '') {
      return `${quoteField(defaultField)} ${defaultDirection}`;
    }
    return '';
  }

  // sorts is a non-empty array
  const sortsArray = sorts as unknown[];
  const parts: string[] = [];

  for (let i = 0; i < sortsArray.length; i++) {
    const entry = sortsArray[i];

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
    const fieldRaw = entryObj['field'];
    if (typeof fieldRaw !== 'string' || fieldRaw.length === 0) {
      throw new TypeError(`sort entry at index ${i} must be a plain object`);
    }

    // Case-insensitive match against allowedFields
    const matchedField = allowedFields.find(
      (af) => af.toLowerCase() === fieldRaw.toLowerCase()
    );

    if (matchedField === undefined) {
      throw new RangeError(`sort field "${fieldRaw}" at index ${i} is not in allowedFields`);
    }

    // Validate direction
    let direction: 'ASC' | 'DESC' = 'ASC';
    if ('direction' in entryObj && entryObj['direction'] !== undefined) {
      const dirRaw = entryObj['direction'];
      if (typeof dirRaw !== 'string') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      const dirUpper = dirRaw.toUpperCase();
      if (dirUpper !== 'ASC' && dirUpper !== 'DESC') {
        throw new RangeError(`sort direction at index ${i} must be ASC or DESC`);
      }
      direction = dirUpper as 'ASC' | 'DESC';
    }

    parts.push(`${quoteField(matchedField)} ${direction}`);
  }

  return parts.join(', ');
}

export { buildSortClause };