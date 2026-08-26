// bloom-deps:

export function validateSortKey(
  key: unknown,
  allowedFields: unknown
): { field: string; direction: 'asc' | 'desc' } {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  if (!key.trim()) {
    throw new RangeError('key must not be empty');
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((el) => typeof el === 'string')
  ) {
    throw new TypeError('allowedFields must be a non-empty array of strings');
  }

  const trimmedKey = key.trim();
  const parts = trimmedKey.split(':');

  if (parts.length > 2) {
    throw new RangeError("key must have at most one ':' separator");
  }

  let field: string;
  let direction: 'asc' | 'desc';

  if (parts.length === 1) {
    field = parts[0].trim();
    direction = 'asc';
  } else {
    field = parts[0].trim();
    const rawDirection = parts[1].trim().toLowerCase();
    if (rawDirection !== 'asc' && rawDirection !== 'desc') {
      if (field === '') {
        throw new RangeError('field must not be empty');
      }
      if (!(allowedFields as string[]).includes(field)) {
        throw new RangeError(`unknown field: ${field}`);
      }
      throw new RangeError("direction must be 'asc' or 'desc'");
    }
    direction = rawDirection as 'asc' | 'desc';
  }

  if (field === '') {
    throw new RangeError('field must not be empty');
  }

  if (!(allowedFields as string[]).includes(field)) {
    throw new RangeError(`unknown field: ${field}`);
  }

  return { field, direction };
}