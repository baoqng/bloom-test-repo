// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('Input must be a non-empty string');
  }

  try {
    const parsed = JSON.parse(input);
    return parsed as T;
  } catch (error) {
    throw new SyntaxError(
      `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
}

export { safeJsonParse };