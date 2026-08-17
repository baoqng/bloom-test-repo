// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError(
      `Expected a non-empty string, but received: ${input === null ? 'null' : typeof input}`
    );
  }

  try {
    return JSON.parse(input) as T;
  } catch (err) {
    throw new SyntaxError(
      `Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export { safeJsonParse };