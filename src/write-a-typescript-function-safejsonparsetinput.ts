// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError(
      `Expected a non-empty string, but received: ${input === null ? 'null' : typeof input}`
    );
  }

  try {
    const result = JSON.parse(input) as T;
    return result;
  } catch (error) {
    throw new SyntaxError(
      `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export { safeJsonParse };