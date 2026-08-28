// bloom-deps:

export function parseCSVLine(line: unknown): string[] {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  const fields: string[] = [];
  let i = 0;
  const len = line.length;

  while (i < len) {
    // At the start of each field
    if (line[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let value = '';
      let closed = false;

      while (i < len) {
        if (line[i] === '"') {
          if (i + 1 < len && line[i + 1] === '"') {
            // Escaped double-quote
            value += '"';
            i += 2;
          } else {
            // Closing quote
            i++; // skip closing quote
            closed = true;
            break;
          }
        } else {
          value += line[i];
          i++;
        }
      }

      if (!closed) {
        throw new RangeError('Quoted field is not properly closed');
      }

      fields.push(value);

      // After closing quote, expect comma or end of string
      if (i < len) {
        if (line[i] === ',') {
          i++; // skip comma
        }
        // If not comma, we skip any trailing content (per CSV conventions)
      }
    } else {
      // Unquoted field: read until comma or end
      let start = i;
      while (i < len && line[i] !== ',') {
        i++;
      }
      fields.push(line.slice(start, i));

      if (i < len && line[i] === ',') {
        i++; // skip comma
      } else {
        // Reached end of string
        break;
      }
    }
  }

  // Handle completely empty string
  if (line.length === 0) {
    return [''];
  }

  return fields;
}