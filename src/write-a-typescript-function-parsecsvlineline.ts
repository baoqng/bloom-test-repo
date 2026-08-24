// bloom-deps:

export function parseCSVLine(line: string, delimiter?: string): string[] {
  // Validate line parameter
  if (typeof line !== 'string') {
    throw new TypeError('Expected string');
  }

  // Validate delimiter parameter if provided
  if (delimiter !== undefined) {
    if (typeof delimiter !== 'string' || delimiter.length !== 1) {
      throw new TypeError('Delimiter must be a single-character string');
    }
  }

  // Default to comma if delimiter not provided
  const delim = delimiter ?? ',';

  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes) {
        // Check if this is an escaped quote (two consecutive quotes)
        if (i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote: add single quote to field and skip both
          currentField += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        // Start of quoted field
        inQuotes = true;
        i++;
      }
    } else if (char === delim && !inQuotes) {
      // Field delimiter found (outside quotes)
      fields.push(currentField);
      currentField = '';
      i++;
    } else {
      // Regular character
      currentField += char;
      i++;
    }
  }

  // Check for unclosed quote
  if (inQuotes) {
    throw new SyntaxError('Unclosed quote in CSV field');
  }

  // Add the last field
  fields.push(currentField);

  return fields;
}