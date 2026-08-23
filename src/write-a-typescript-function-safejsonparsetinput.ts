// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input === '') {
    throw new TypeError(
      `Input must be a non-empty string, but received: ${input === null ? 'null' : typeof input === 'string' ? 'empty string' : typeof input}`
    );
  }

  try {
    return JSON.parse(input) as T;
  } catch (e) {
    throw new SyntaxError(`Failed to parse JSON: ${(e as Error).message}`);
  }
}

export { safeJsonParse };