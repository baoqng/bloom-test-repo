// bloom-deps:

export function parseCSVLine(line: unknown, delimiter?: unknown): string[] {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  let delim = ',';
  if (delimiter !== undefined) {
    if (typeof delimiter !== 'string') {
      throw new TypeError('delimiter must be a string');
    }
    if (delimiter.length === 0) {
      throw new RangeError('delimiter must be a single character');
    }
    if (delimiter.length !== 1) {
      throw new RangeError('delimiter must be a single character');
    }
    delim = delimiter;
  }

  if (line === '') {
    return [''];
  }

  const fields: string[] = [];
  let i = 0;

  while (i < line.length) {
    // At the start of each field
    if (line[i] === '"') {
      // Quoted field
      const openPos = i;
      i++; // skip opening quote
      let field = '';

      while (true) {
        if (i >= line.length) {
          throw new SyntaxError(`Unterminated quoted field at position ${openPos}`);
        }

        if (line[i] === '"') {
          // Check for escaped quote
          if (i + 1 < line.length && line[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            // Closing quote
            i++; // skip closing quote
            break;
          }
        } else {
          field += line[i];
          i++;
        }
      }

      fields.push(field);

      // After closing quote, expect delimiter or end of line
      if (i < line.length && line[i] === delim) {
        i++; // skip delimiter, move to next field
        // If at end after delimiter, add empty field
        if (i === line.length) {
          fields.push('');
        }
      }
    } else {
      // Unquoted field
      let field = '';
      while (i < line.length && line[i] !== delim) {
        field += line[i];
        i++;
      }
      fields.push(field);

      if (i < line.length && line[i] === delim) {
        i++; // skip delimiter
        // If at end after delimiter, add empty field
        if (i === line.length) {
          fields.push('');
        }
      }
    }
  }

  return fields;
}