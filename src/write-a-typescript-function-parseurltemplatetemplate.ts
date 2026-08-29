// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // Object.create(null) has null prototype — still a plain object
  return Object.getPrototypeOf(value) === null || true;
}

// Re-implement isPlainObject properly:
function checkIsPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  // Handles Object.create(null) and regular {}
  return proto === null || proto === Object.prototype;
}

export function parseUrlTemplate(template: unknown, variables: unknown): string {
  // Validate template
  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string');
  }

  // Validate variables
  if (!checkIsPlainObject(variables)) {
    throw new TypeError('variables must be a plain object');
  }

  const vars = variables as Record<string, unknown>;
  const result: string[] = [];
  const tpl = template as string;
  let i = 0;

  while (i < tpl.length) {
    const openIdx = tpl.indexOf('{', i);

    if (openIdx === -1) {
      // No more '{', append the rest as literal
      result.push(tpl.slice(i));
      break;
    }

    // Append literal text before '{'
    if (openIdx > i) {
      result.push(tpl.slice(i, openIdx));
    }

    // Look for matching '}'
    const closeIdx = tpl.indexOf('}', openIdx + 1);

    if (closeIdx === -1) {
      // No closing '}', treat '{' as literal and advance past it
      result.push('{');
      i = openIdx + 1;
      continue;
    }

    // Extract varname between '{' and '}'
    const varname = tpl.slice(openIdx + 1, closeIdx);

    // Validate varname: must be non-empty and contain only valid chars
    // RFC 6570 varname: varchar = ALPHA / DIGIT / "_" / pct-encoded / "."
    // For Level 1, we treat any non-empty string without special operators as a valid varname
    // Check if it's a valid simple expression (no operator prefix chars like +, #, ., /, ;, ?, &, =, ,, !)
    const operatorChars = /^[+#./;?&=,!@|]/;

    if (varname.length === 0 || operatorChars.test(varname)) {
      // Not a valid simple expression — treat as literal braces passthrough
      result.push('{');
      result.push(varname);
      result.push('}');
      i = closeIdx + 1;
      continue;
    }

    // Check if varname contains invalid characters (treat as literal if so)
    // Valid varname chars for RFC 6570: ALPHA, DIGIT, _, ., pct-encoded
    // For simplicity, allow alphanumeric, underscore, dot, hyphen (common in practice)
    if (!/^[A-Za-z0-9_.\-]+$/.test(varname)) {
      // Not a valid expression — passthrough
      result.push('{');
      result.push(varname);
      result.push('}');
      i = closeIdx + 1;
      continue;
    }

    // Look up variable
    if (!(varname in vars) || vars[varname] === null || vars[varname] === undefined) {
      throw new RangeError(`Undefined variable: ${varname}`);
    }

    const rawValue = vars[varname];
    const strValue = typeof rawValue === 'string' ? rawValue : String(rawValue);
    const encoded = encodeURIComponent(strValue);

    result.push(encoded);
    i = closeIdx + 1;
  }

  return result.join('');
}