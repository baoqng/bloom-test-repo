// bloom-deps:

export function parseHeaderList(header: unknown): string[] {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    return [];
  }

  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  const len = header.length;

  for (let i = 0; i < len; i++) {
    const ch = header[i];

    if (inQuotes) {
      if (ch === '\\' && i + 1 < len) {
        // Escaped character: treat backslash + next char as single character
        current += ch;
        current += header[i + 1];
        i++;
      } else if (ch === '"') {
        // Closing quote
        current += ch;
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        current += ch;
      } else if (ch === ',') {
        // Split point
        const trimmed = current.trim();
        if (trimmed.length > 0) {
          tokens.push(trimmed);
        }
        current = '';
      } else {
        current += ch;
      }
    }
  }

  // Handle last token
  const trimmed = current.trim();
  if (trimmed.length > 0) {
    tokens.push(trimmed);
  }

  return tokens;
}