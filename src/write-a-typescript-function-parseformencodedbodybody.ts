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

export function parseFormEncodedBody(body: unknown): Record<string, string> {
  // [REQUIRED] typeof check for string input
  if (typeof body !== 'string') {
    throw new TypeError(`Expected body to be a string, got ${typeof body}`);
  }

  // Return empty object for empty string input
  if (body === '') {
    return {};
  }

  const result: Record<string, string> = {};

  // Split on '&' to get segments
  const segments = body.split('&');

  for (const segment of segments) {
    // Skip empty segments
    if (segment === '') {
      continue;
    }

    // Split on the first '=' to get key and value
    const equalIndex = segment.indexOf('=');
    let key: string;
    let value: string;

    if (equalIndex === -1) {
      // No '=' found, entire segment is the key, value is empty string
      key = segment;
      value = '';
    } else {
      // Split on first '=' only
      key = segment.substring(0, equalIndex);
      value = segment.substring(equalIndex + 1);
    }

    // Perform percent-decoding on key and value
    // First replace '+' with space, then use decodeURIComponent
    try {
      const decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
      const decodedValue = decodeURIComponent(value.replace(/\+/g, ' '));

      // Throw error if decoded key is empty
      if (decodedKey === '') {
        throw new SyntaxError(`Empty key in segment '${segment}'`);
      }

      // For duplicate keys, last value wins
      result[decodedKey] = decodedValue;
    } catch (error) {
      // If decodeURIComponent throws, it's malformed percent-encoding
      if (error instanceof SyntaxError && error.message.includes('Empty key')) {
        throw error;
      }
      // Any other error from decodeURIComponent is malformed encoding
      throw new SyntaxError(`Malformed percent-encoding in segment '${segment}'`);
    }
  }

  return result;
}