// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (
      proto.constructor !== undefined &&
      typeof proto.constructor === "function" &&
      proto.constructor !== Object
    ) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function applyFieldProjection<T extends Record<string, unknown>>(
  source: unknown,
  fields: unknown
): Partial<T> {
  // Validate source
  if (
    source === null ||
    typeof source !== "object" ||
    Array.isArray(source) ||
    !isPlainObject(source)
  ) {
    throw new TypeError("source must be a plain object");
  }

  // Validate fields
  if (!Array.isArray(fields)) {
    throw new TypeError("fields must be a non-empty array of strings");
  }

  if (fields.length === 0) {
    throw new TypeError("fields must be a non-empty array of strings");
  }

  for (const field of fields) {
    if (typeof field !== "string") {
      throw new TypeError("fields must be a non-empty array of strings");
    }
  }

  // Validate each field name (non-empty, non-whitespace)
  for (const field of fields as string[]) {
    if (field.trim() === "") {
      throw new RangeError("each field name must be a non-empty string");
    }
  }

  // Build result
  const result: Partial<T> = {};
  const sourceObj = source as Record<string, unknown>;

  for (const field of fields as string[]) {
    if (Object.prototype.hasOwnProperty.call(sourceObj, field)) {
      (result as Record<string, unknown>)[field] = sourceObj[field];
    }
  }

  return result;
}