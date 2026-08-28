// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== "object") return false;
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

export function parseTemplateLiteral(template: unknown, vars: unknown): string {
  if (typeof template !== "string") {
    throw new TypeError("template must be a string");
  }

  if (!isPlainObject(vars)) {
    throw new TypeError("vars must be a plain non-null object");
  }

  const varsObj = vars as Record<string, unknown>;

  // Validate all values in vars
  for (const key of Object.keys(varsObj)) {
    const val = varsObj[key];
    if (typeof val !== "string" && typeof val !== "number") {
      throw new TypeError(
        `Value for key "${key}" must be a string or number, got ${typeof val}`
      );
    }
  }

  // Find all placeholders
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const matches = template.matchAll(placeholderRegex);

  for (const match of matches) {
    const key = match[1];
    if (!Object.prototype.hasOwnProperty.call(varsObj, key)) {
      throw new RangeError(
        `No value found for placeholder "{{${key}}}"`
      );
    }
  }

  // Replace all occurrences
  const result = template.replace(placeholderRegex, (_match, key) => {
    return String(varsObj[key]);
  });

  return result;
}