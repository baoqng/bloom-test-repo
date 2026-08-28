// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;

  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Make sure the next step is null (i.e., Object.prototype is at the top)
      break;
    }
    proto = Object.getPrototypeOf(proto);
  }

  // The object is plain only if its prototype is Object.prototype or null
  const directProto = Object.getPrototypeOf(value);
  return directProto === Object.prototype || directProto === null;
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
  const result: Record<string, unknown> = Object.assign({}, inputObj);

  // Apply defaults for keys absent from input
  for (const key of Object.keys(defaultsObj)) {
    if (!Object.prototype.hasOwnProperty.call(inputObj, key)) {
      result[key] = defaultsObj[key];
    }
  }

  return result as T;
}