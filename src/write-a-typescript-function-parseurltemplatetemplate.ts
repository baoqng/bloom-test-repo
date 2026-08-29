// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function parseUrlTemplate(template: unknown, variables: unknown): string {
  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string');
  }

  if (!isPlainObject(variables)) {
    throw new TypeError('variables must be a plain object');
  }

  const vars = variables as Record<string, unknown>;

  let result = '';
  let i = 0;

  while (i < template.length) {
    const ch = template[i];

    if (ch === '{') {
      const closeIdx = template.indexOf('}', i + 1);

      if (closeIdx === -1) {
        // No closing brace found, passthrough literal '{'
        result += '{';
        i++;
        continue;
      }

      const varname = template.slice(i + 1, closeIdx);

      // Validate that varname is a simple identifier (no nested braces, no operators)
      // For RFC 6570 Level 1, varname should be a valid variable name
      if (varname.length === 0 || varname.includes('{') || varname.includes('}')) {
        // Not a valid expression, passthrough literal '{'
        result += '{';
        i++;
        continue;
      }

      // Check if the variable exists and has a non-null/undefined value
      if (!(varname in vars) || vars[varname] === null || vars[varname] === undefined) {
        throw new RangeError(`Undefined variable: ${varname}`);
      }

      const rawValue = vars[varname];
      const strValue = typeof rawValue === 'string' ? rawValue : String(rawValue);
      const encoded = encodeURIComponent(strValue);

      result += encoded;
      i = closeIdx + 1;
    } else if (ch === '}') {
      // Literal '}' not part of a valid expression
      result += '}';
      i++;
    } else {
      result += ch;
      i++;
    }
  }

  return result;
}