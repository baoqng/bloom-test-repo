// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input === '') {
    throw new TypeError('input must be a non-empty string');
  }
  try {
    return JSON.parse(input) as T;
  } catch (e) {
    throw new SyntaxError(`Failed to parse JSON: ${(e as Error).message}`);
  }
}

export { safeJsonParse };