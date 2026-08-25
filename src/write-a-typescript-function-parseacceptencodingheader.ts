// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

interface EncodingEntry {
  encoding: string;
  q: number;
}

export function parseAcceptEncoding(header: unknown): EncodingEntry[] {
  // Validate input type
  if (typeof header !== 'string') {
    throw new TypeError(`Expected header to be a string, got ${typeof header}`);
  }

  // Return empty array for empty string
  if (header === '') {
    return [];
  }

  const entries: EncodingEntry[] = [];
  const encodingEntries = header.split(',');

  for (const rawEntry of encodingEntries) {
    const trimmedEntry = rawEntry.trim();

    // Skip empty entries (e.g., from trailing commas or multiple spaces)
    if (trimmedEntry === '') {
      throw new SyntaxError(`Invalid encoding token: ''`);
    }

    const parts = trimmedEntry.split(';');
    const encodingToken = parts[0].trim();

    // Validate encoding token
    if (encodingToken === '') {
      throw new SyntaxError(`Invalid encoding token: ''`);
    }

    // Check if token contains only valid characters [a-zA-Z0-9*-]
    if (!/^[a-zA-Z0-9*-]+$/.test(encodingToken)) {
      throw new SyntaxError(`Invalid encoding token: '${encodingToken}'`);
    }

    let q = 1.0;

    // Process parameters
    for (let i = 1; i < parts.length; i++) {
      const parameter = parts[i].trim();

      if (parameter.startsWith('q=')) {
        const qValueRaw = parameter.substring(2).trim();

        // Attempt to parse q-value as float
        const qValue = parseFloat(qValueRaw);

        // Check if parsing was successful and value is within [0, 1]
        if (isNaN(qValue) || qValue < 0 || qValue > 1) {
          throw new SyntaxError(`Invalid q-value: '${qValueRaw}'`);
        }

        q = qValue;
      }
      // Ignore unrecognized parameters (passthrough behavior)
    }

    entries.push({
      encoding: encodingToken,
      q,
    });
  }

  // Sort by q descending (stable sort preserves original order for equal q values)
  entries.sort((a, b) => b.q - a.q);

  return entries;
}