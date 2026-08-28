// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Walk the full prototype chain and reject only if a non-Object constructor is found
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    const ctor = proto.constructor;
    if (ctor && ctor !== Object) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function resolveTemplateString(template: unknown, variables: unknown): string {
  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string');
  }

  if (!isPlainObject(variables)) {
    throw new TypeError('variables must be a plain object');
  }

  const vars = variables as Record<string, unknown>;

  // Process the template string character by character
  let result = '';
  let i = 0;
  const len = template.length;

  while (i < len) {
    // Check for {{ (potential placeholder or escape)
    if (template[i] === '{' && i + 1 < len && template[i + 1] === '{') {
      // Look for the next }}
      const closeIdx = template.indexOf('}}', i + 2);
      
      if (closeIdx !== -1) {
        // There's a potential placeholder
        const varName = template.slice(i + 2, closeIdx);
        
        // If varName itself contains {{ or }}, this is more complex
        // For simplicity per spec: {{varName}} where varName has no braces
        if (!varName.includes('{') && !varName.includes('}') && varName.trim().length > 0) {
          // This is a placeholder
          if (!(varName in vars)) {
            throw new RangeError(`Unknown variable: ${varName}`);
          }
          result += String(vars[varName]);
          i = closeIdx + 2;
          continue;
        }
      }
      
      // It's an escaped {{ -> output single {
      result += '{';
      i += 2;
      continue;
    }

    // Check for }} (escaped close brace)
    if (template[i] === '}' && i + 1 < len && template[i + 1] === '}') {
      result += '}';
      i += 2;
      continue;
    }

    // Regular character
    result += template[i];
    i += 1;
  }

  return result;
}