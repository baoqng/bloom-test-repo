// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // If we never found Object.prototype in chain, it's not a plain object
  // Actually we need to check if the direct prototype is Object.prototype
  return false;
}

function isPlainObjectStrict(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildSortClause(sorts: unknown, allowedFields: unknown): string {
  // Validate allowedFields
  if (!Array.isArray(allowedFields)) {
    throw new TypeError('allowedFields must be an array');
  }
  if (allowedFields.length === 0) {
    throw new TypeError('allowedFields must be a non-empty array');
  }
  for (const field of allowedFields) {
    if (typeof field !== 'string') {
      throw new TypeError('allowedFields must contain only strings');
    }
    if (field.length === 0) {
      throw new TypeError('allowedFields must contain only non-empty strings');
    }
  }

  // Validate sorts
  if (!Array.isArray(sorts)) {
    throw new TypeError('sorts must be an array');
  }

  if (sorts.length === 0) {
    return '';
  }

  const seenFields = new Set<string>();

  const parts: string[] = [];

  for (const sort of sorts) {
    // Check plain object - walk full prototype chain
    if (sort === null || typeof sort !== 'object') {
      throw new TypeError('each element of sorts must be a plain object');
    }
    const proto = Object.getPrototypeOf(sort);
    if (proto !== Object.prototype && proto !== null) {
      throw new TypeError('each element of sorts must be a plain object');
    }

    const sortObj = sort as Record<string, unknown>;

    // Validate field
    if (typeof sortObj['field'] !== 'string' || sortObj['field'].length === 0) {
      throw new TypeError("each sort element must have a non-empty string field 'field'");
    }
    const fieldValue = sortObj['field'] as string;

    // Validate direction presence and type
    if (typeof sortObj['direction'] !== 'string') {
      throw new TypeError("each sort element must have a string field 'direction'");
    }
    const directionValue = sortObj['direction'] as string;

    // Validate direction value
    if (directionValue !== 'asc' && directionValue !== 'ASC' && directionValue !== 'desc' && directionValue !== 'DESC') {
      throw new RangeError("direction must be one of 'asc', 'ASC', 'desc', 'DESC'");
    }

    // Validate field is in allowedFields
    if (!(allowedFields as string[]).includes(fieldValue)) {
      throw new RangeError(`field '${fieldValue}' is not in allowedFields`);
    }

    // Check for duplicates
    if (seenFields.has(fieldValue)) {
      throw new RangeError(`duplicate field value '${fieldValue}' in sorts`);
    }
    seenFields.add(fieldValue);

    const normalizedDirection = directionValue.toUpperCase();
    parts.push(`"${fieldValue}" ${normalizedDirection}`);
  }

  return 'ORDER BY ' + parts.join(', ');
}