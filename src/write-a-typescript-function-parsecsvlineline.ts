// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseCSVLine(line: unknown): string[] {
  // Input validation guard: Check type
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  // Check maxLength - reasonable limit for a CSV line
  if (line.length > 1000000) {
    throw new Error('CSV line exceeds maximum length');
  }

  const fields: string[] = [];
  let currentField = '';
  let isQuoted = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (isQuoted) {
      // We are inside a quoted field
      if (char === '"') {
        // Check if this is an escaped quote (doubled)
        if (i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote: add single quote to field and skip both
          currentField += '"';
          i += 2;
        } else {
          // This is the closing quote
          isQuoted = false;
          i += 1;
        }
      } else {
        // Regular character inside quoted field (including commas and newlines)
        currentField += char;
        i += 1;
      }
    } else {
      // We are outside a quoted field
      if (char === '"') {
        // Opening quote - must be at the start of a field
        if (currentField === '') {
          isQuoted = true;
          i += 1;
        } else {
          // Quote in the middle of unquoted field - treat as literal
          currentField += char;
          i += 1;
        }
      } else if (char === ',') {
        // Field separator
        fields.push(currentField);
        currentField = '';
        i += 1;
      } else {
        // Regular character in unquoted field
        currentField += char;
        i += 1;
      }
    }
  }

  // Check for unclosed quoted field
  if (isQuoted) {
    throw new RangeError('Unclosed quoted field: opening quote with no matching closing quote');
  }

  // Push the last field
  fields.push(currentField);

  return fields;
}

export { parseCSVLine, ServiceError };