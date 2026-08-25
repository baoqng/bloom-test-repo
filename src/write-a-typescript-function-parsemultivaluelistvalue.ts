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
      // We've consumed everything; if we got here from a trailing comma, add empty? 
      // The spec doesn't mention trailing commas, so just break
      break;
    }

    if (value[i] === '"') {
      // Quoted string
      i++; // skip opening quote
      let item = '';
      let closed = false;

      while (i < len) {
        const ch = value[i];
        if (ch === '\\' && i + 1 < len) {
          // Escaped character
          item += value[i + 1];
          i += 2;
        } else if (ch === '"') {
          closed = true;
          i++; // skip closing quote
          break;
        } else {
          item += ch;
          i++;
        }
      }

      if (!closed) {
        throw new SyntaxError('Unterminated quoted string');
      }

      result.push(item);

      // Skip whitespace after closing quote
      while (i < len && (value[i] === ' ' || value[i] === '\t')) {
        i++;
      }

      // Expect comma or end
      if (i < len && value[i] === ',') {
        i++; // skip comma
      }
    } else {
      // Unquoted token — read until next comma
      let start = i;
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