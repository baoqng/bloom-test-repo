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
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new SyntaxError('Invalid JSON: ' + err.message);
    }
    throw err;
  }
}