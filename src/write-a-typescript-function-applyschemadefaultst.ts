// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  // Walk the full prototype chain and reject only if a non-Object constructor is found
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto.constructor && proto.constructor !== Object) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function applySchemaDefaults<T extends Record<string, unknown>>(
  input: unknown,
  defaults: unknown
): T {
  if (!isPlainObject(input)) {
    throw new TypeError('input must be a plain object');
  }
  if (!isPlainObject(defaults)) {
    throw new TypeError('defaults must be a plain object');
  }

  const inputObj = input as Record<string, unknown>;
  const defaultsObj = defaults as Record<string, unknown>;

  // Shallow copy of input
  const result: Record<string, unknown> = { ...inputObj };

  // Add keys from defaults that are entirely absent from input
  for (const key of Object.keys(defaultsObj)) {
    if (!Object.prototype.hasOwnProperty.call(inputObj, key)) {
      result[key] = defaultsObj[key];
    }
  }

  return result as T;
}