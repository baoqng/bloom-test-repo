// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError(
      `safeJsonParse: input must be a non-empty string, received ${
        input === null ? 'null' : typeof input
      }`
    );
  }

  try {
    return JSON.parse(input) as T;
  } catch (error) {
    throw new SyntaxError(
      `safeJsonParse: failed to parse JSON string: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export { safeJsonParse };