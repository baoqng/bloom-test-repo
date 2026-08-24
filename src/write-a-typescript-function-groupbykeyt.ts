// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function groupByKey<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  // Input validation: arr must be an Array
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  // Input validation: key must be a string
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  // Input validation: key cannot be an empty string
  if (key === '') {
    throw new RangeError('key cannot be an empty string');
  }

  // Initialize result object
  const result: Record<string, T[]> = {};

  // Group elements by key value
  for (const element of arr) {
    // Get the value at the key for this element
    const value = element[key];

    // Determine the group key
    let groupKey: string;
    if (value === null || value === undefined) {
      groupKey = '__null__';
    } else if (typeof value === 'string') {
      groupKey = value;
    } else {
      // Convert non-string, non-null values to their string representation
      groupKey = String(value);
    }

    // Initialize the group array if it doesn't exist
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Add the element to its group
    result[groupKey].push(element);
  }

  return result;
}