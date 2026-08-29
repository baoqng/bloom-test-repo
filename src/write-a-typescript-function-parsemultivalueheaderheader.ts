// bloom-deps:

export function parseMultiValueHeader(header: unknown): string[] {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    return [];
  }

  const results: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  const len = header.length;

  while (i < len) {
    const ch = header[i];

    if (inQuotes) {
      if (ch === '\\' && i + 1 < len && header[i + 1] === '"') {
        // Escaped quote inside quoted string — passthrough both characters
        current += '\\"';
        i += 2;
        continue;
      } else if (ch === '"') {
        // Closing quote
        inQuotes = false;
        i++;
        continue;
      } else {
        current += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (ch === ',') {
        results.push(current.trim());
        current = '';
        i++;
        continue;
      } else {
        current += ch;
        i++;
        continue;
      }
    }
  }

  if (inQuotes) {
    throw new SyntaxError('Unclosed quoted string');
  }

  results.push(current.trim());

  return results;
}