// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseAcceptCharset(header: unknown): Array<{ charset: string; q: number }> {
  // [REQUIRED] typeof check for string input
  if (typeof header !== 'string') {
    throw new TypeError('Accept-Charset header must be a string');
  }

  // [REQUIRED] Check for empty or whitespace-only string
  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const result: Array<{ charset: string; q: number }> = [];

  // Split on commas
  const entries = trimmed.split(',');

  for (const entry of entries) {
    const entryTrimmed = entry.trim();

    // [REQUIRED] Throw RangeError if charset name is empty after trimming
    if (entryTrimmed.length === 0) {
      throw new RangeError('Charset name cannot be empty');
    }

    // Split on semicolon
    const parts = entryTrimmed.split(';');
    const charsetName = parts[0].trim().toLowerCase();

    // [REQUIRED] Throw RangeError if charset name is empty
    if (charsetName.length === 0) {
      throw new RangeError('Charset name cannot be empty');
    }

    let q = 1.0;

    // Parse q parameter if present
    if (parts.length > 1) {
      const qPart = parts[1].trim();
      if (qPart.startsWith('q=')) {
        const qValueStr = qPart.slice(2).trim();
        const qValue = parseFloat(qValueStr);

        // [REQUIRED] Check if q is a valid number
        if (Number.isNaN(qValue)) {
          throw new RangeError('Quality (q) value must be a valid number');
        }

        // [REQUIRED] Check if q is in range [0, 1]
        if (qValue < 0 || qValue > 1) {
          throw new RangeError('Quality (q) value must be between 0 and 1');
        }

        q = qValue;
      }
    }

    result.push({ charset: charsetName, q });
  }

  // Sort descending by q value
  result.sort((a, b) => b.q - a.q);

  return result;
}

export { parseAcceptCharset, ServiceError };