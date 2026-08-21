// bloom-deps:

function parseJsonSafe<T>(input: unknown): T | null {
  if (typeof input !== 'string' || input.length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(input);
    if (parsed === null) {
      return null;
    }
    return parsed as T;
  } catch (e) {
    return null;
  }
}

export { parseJsonSafe };