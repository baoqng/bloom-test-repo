// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  try {
    return JSON.parse(input) as T;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new SyntaxError(`Failed to parse JSON: ${message}`);
  }
}

export { safeJsonParse };