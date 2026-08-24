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

export function buildSortKey(fields: unknown): string {
  // Input validation guard: typeof check for Array
  if (!Array.isArray(fields)) {
    throw new TypeError('fields must be an Array');
  }

  // Check for empty array
  if (fields.length === 0) {
    throw new RangeError('fields array cannot be empty');
  }

  // Process each element
  const normalized: string[] = [];

  for (let i = 0; i < fields.length; i++) {
    const element = fields[i];
    const elementType = typeof element;

    // Check element type: must be string, number, or boolean
    if (elementType !== 'string' && elementType !== 'number' && elementType !== 'boolean') {
      throw new TypeError(`Element at index ${i} must be a string, number, or boolean, got ${elementType}`);
    }

    if (elementType === 'string') {
      // String element: check for null byte
      const str = element as string;
      if (str.includes('\0')) {
        throw new RangeError(`String element at index ${i} contains reserved null byte separator`);
      }
      normalized.push(str);
    } else if (elementType === 'number') {
      // Number element: check for finite
      const num = element as number;
      if (!Number.isFinite(num)) {
        throw new RangeError(`Number element at index ${i} is not finite (got ${num})`);
      }
      normalized.push(String(num));
    } else if (elementType === 'boolean') {
      // Boolean element: convert to 'true' or 'false'
      const bool = element as boolean;
      normalized.push(bool ? 'true' : 'false');
    }
  }

  // Join with null-byte separator
  return normalized.join('\0');
}