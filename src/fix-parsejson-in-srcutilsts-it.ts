// bloom-deps:

export function parseJSON(jsonString: unknown): unknown {
  if (jsonString === null || jsonString === undefined) {
    throw new TypeError('jsonString is required');
  }

  if (typeof jsonString !== 'string') {
    throw new TypeError('jsonString must be a string');
  }

  if (jsonString.trim() === '') {
    throw new TypeError('jsonString cannot be empty');
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError('Invalid JSON: ' + error.message);
    }
    throw error;
  }
}