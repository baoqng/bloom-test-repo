// bloom-deps:

function safeJsonParse<T>(input: unknown): T {
  if (
    typeof input !== 'string' ||
    !input ||
    input === '' ||
    input.trim() === ''
  ) {
    throw new TypeError('Input must be a non-empty string');
  }

  try {
    return JSON.parse(input) as T;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown parse error';
    throw new SyntaxError(`Failed to parse JSON: ${message}`);
  }
}

export { safeJsonParse };