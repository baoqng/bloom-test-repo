// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Array.prototype) return false;
    proto = Object.getPrototypeOf(proto);
  }
  // Re-check: plain object must have Object.prototype or null as its direct prototype
  const directProto = Object.getPrototypeOf(value);
  return directProto === Object.prototype || directProto === null;
}

export function resolveTemplateVars(template: unknown, vars: unknown): string {
  if (typeof template !== 'string') {
    throw new TypeError('template must be a string');
  }

  if (!isPlainObject(vars)) {
    throw new TypeError('vars must be a plain object');
  }

  const result: string[] = [];
  let i = 0;
  const len = template.length;

  while (i < len) {
    const openIdx = template.indexOf('{{', i);

    if (openIdx === -1) {
      // No more placeholders, append the rest
      result.push(template.slice(i));
      break;
    }

    // Append text before the placeholder
    result.push(template.slice(i, openIdx));

    // Find closing }}
    const closeIdx = template.indexOf('}}', openIdx + 2);
    if (closeIdx === -1) {
      // No closing }}, treat as literal text
      result.push(template.slice(openIdx));
      break;
    }

    const varName = template.slice(openIdx + 2, closeIdx);

    // Validate variable name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
      throw new SyntaxError(`Invalid placeholder name: "${varName}"`);
    }

    // Check variable exists in vars
    if (!Object.prototype.hasOwnProperty.call(vars, varName)) {
      throw new RangeError(`Variable "${varName}" is not defined in vars`);
    }

    const value = (vars as Record<string, unknown>)[varName];

    // Validate resolved value type
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(`Resolved value for "${varName}" must be a string or number`);
    }

    // Coerce number to string
    result.push(String(value));

    i = closeIdx + 2;
  }

  return result.join('');
}