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

  while (i <= line.length) {
    // Start of a new field
    if (i < line.length && line[i] === '"') {
      // Quoted field
      const openPos = i;
      i++; // skip opening quote
      let value = '';

      while (true) {
        if (i >= line.length) {
          throw new SyntaxError(`Unterminated quoted field at position ${openPos}`);
        }

        if (line[i] === '"') {
          // Check for escaped quote (two consecutive double-quotes)
          if (i + 1 < line.length && line[i + 1] === '"') {
            value += '"';
            i += 2;
          } else {
            // Closing quote
            i++; // skip closing quote
            break;
          }
        } else {
          value += line[i];
          i++;
        }
      }

      fields.push(value);

      // After closing quote, expect delimiter or end of line
      if (i < line.length) {
        if (line[i] === delim) {
          i++; // skip delimiter
          // If this was the last character (trailing delimiter), add empty field
          if (i === line.length) {
            fields.push('');
            break;
          }
        }
        // else: content after closing quote before delimiter — per RFC 4180 this is technically invalid
        // but we'll just continue; the next iteration will handle remaining content
      } else {
        // End of line after closing quote
        break;
      }
    } else {
      // Unquoted field
      let value = '';
      while (i < line.length && line[i] !== delim) {
        value += line[i];
        i++;
      }

      fields.push(value);

      if (i < line.length && line[i] === delim) {
        i++; // skip delimiter
        // Trailing delimiter: add empty field
        if (i === line.length) {
          fields.push('');
          break;
        }
      } else {
        // End of line
        break;
      }
    }
  }

  return fields;
}