// bloom-deps:

function parseCSVLine(line: unknown): string[] {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  const result: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          currentField += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        currentField += char;
        i += 1;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i += 1;
      } else if (char === ',') {
        result.push(currentField);
        currentField = '';
        i += 1;
      } else {
        currentField += char;
        i += 1;
      }
    }
  }

  if (inQuotes) {
    throw new RangeError('quoted field is not properly closed');
  }

  result.push(currentField);

  return result;
}

export { parseCSVLine };