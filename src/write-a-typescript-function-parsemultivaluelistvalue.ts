// bloom-deps:

export function parseMultiValueList(value: unknown): string[] {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (value.trim() === '') {
    return [];
  }

  const result: string[] = [];
  let i = 0;
  const len = value.length;

  while (i <= len) {
    // Skip leading whitespace
    while (i < len && (value[i] === ' ' || value[i] === '\t')) {
      i++;
    }

    if (i >= len) {
      // Trailing comma or end
      break;
    }

    if (value[i] === '"') {
      // Quoted string
      i++; // skip opening quote
      let str = '';
      let closed = false;

      while (i < len) {
        const ch = value[i];
        if (ch === '\\') {
          i++;
          if (i < len) {
            str += value[i];
            i++;
          }
        } else if (ch === '"') {
          closed = true;
          i++; // skip closing quote
          break;
        } else {
          str += ch;
          i++;
        }
      }

      if (!closed) {
        throw new SyntaxError('Unterminated quoted string');
      }

      result.push(str);

      // Skip whitespace after closing quote
      while (i < len && (value[i] === ' ' || value[i] === '\t')) {
        i++;
      }

      // Expect comma or end
      if (i < len && value[i] === ',') {
        i++; // skip comma
      } else if (i < len) {
        // Unexpected character after closing quote — skip to next comma
        while (i < len && value[i] !== ',') {
          i++;
        }
        if (i < len) {
          i++; // skip comma
        }
      }
    } else {
      // Unquoted token — read until next comma
      const start = i;
      while (i < len && value[i] !== ',') {
        i++;
      }

      const token = value.slice(start, i).trim();
      result.push(token);

      if (i < len && value[i] === ',') {
        i++; // skip comma
      }
    }
  }

  return result;
}