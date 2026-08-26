// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function validateObjectShape<T extends Record<string, unknown>>(
  obj: unknown,
  required: unknown,
  optional: unknown
): T {
  // Validate obj
  if (!isPlainObject(obj) || Array.isArray(obj)) {
    throw new TypeError('obj must be a plain object');
  }

  // Validate required
  if (!Array.isArray(required)) {
    throw new TypeError('required must be an array of strings');
  }
  for (const el of required) {
    if (typeof el !== 'string') {
      throw new TypeError('required must be an array of strings');
    }
  }

  // Validate optional
  if (!Array.isArray(optional)) {
    throw new TypeError('optional must be an array of strings');
  }
  for (const el of optional) {
    if (typeof el !== 'string') {
      throw new TypeError('optional must be an array of strings');
    }
  }

  // Check overlap
  const requiredSet = new Set(required as string[]);
  const optionalSet = new Set(optional as string[]);
  for (const field of requiredSet) {
    if (optionalSet.has(field)) {
      throw new RangeError('required and optional fields must not overlap');
    }
  }

  // Check missing required fields
  for (const field of required as string[]) {
    if (!Object.prototype.hasOwnProperty.call(obj, field)) {
      throw new RangeError(`missing required field: ${field}`);
    }
  }

  // Check unknown fields
  for (const key of Object.keys(obj)) {
    if (!requiredSet.has(key) && !optionalSet.has(key)) {
      throw new RangeError(`unknown field: ${key}`);
    }
  }

  return obj as T;
}