// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function resolveTemplateString(template: unknown, variables: unknown): string {
  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string');
  }

  if (!isPlainObject(variables)) {
    throw new TypeError('variables must be a plain object');
  }

  const vars = variables as Record<string, unknown>;

  // Process the template character by character
  let result = '';
  let i = 0;
  const len = template.length;

  while (i < len) {
    // Check for {{ (escaped open brace)
    if (template[i] === '{' && i + 1 < len && template[i + 1] === '{') {
      // Check if it's a placeholder {{name}} or escaped {{
      // Look ahead: if after {{ there's content followed by }}, it's a placeholder
      // But if it's {{{{ or just {{ with no matching }}, treat as escape
      // First, check if this is an escape sequence (next char after {{ is not part of a var name leading to }})
      // We need to determine: is this {{ an escape or start of placeholder?
      // Strategy: look for the closing }}
      // If the very next chars form }}, it's an escaped {{ followed by }}
      // Otherwise, search for }} to find end of placeholder

      // Check if next two chars are }} (i.e., {{}} which is empty placeholder - treat as escaped {{ and }})
      // Actually per spec: {{ -> { and }} -> }
      // So {{NAME}} = escaped { + NAME + escaped } ? No.
      // Re-read: "Leave literal {{ and }} escape sequences (doubled braces) as single { and } in the output"
      // So {{ anywhere becomes {, and }} anywhere becomes }
      // But {{NAME}} should be a placeholder...
      // We need to distinguish: {{ that are escape vs {{ that start a placeholder
      // Convention: if {{ is followed by identifier chars and then }}, it's a placeholder
      // If {{ is followed immediately by another { or }, it's an escape

      // Look ahead after {{ to find }}
      const afterOpen = i + 2;
      const closeIdx = template.indexOf('}}', afterOpen);

      if (closeIdx !== -1) {
        // There's a closing }}; check if content between is a valid variable name
        const content = template.slice(afterOpen, closeIdx);
        // Check if content itself contains {{ or }}
        if (content.indexOf('{{') === -1 && content.indexOf('}}') === -1 && content.length > 0) {
          // This is a placeholder
          const varName = content;
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

    result += template[i];
    i += 1;
  }

  return result;
}