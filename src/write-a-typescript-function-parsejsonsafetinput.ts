// bloom-deps:

export function parseJsonSafe<T>(input: unknown): T | null {
  if (typeof input !== 'string') {
    return null;
  }
  if (input === '') {
    return null;
  }
  try {
    const parsed = JSON.parse(input) as T;
    if (parsed === null) {
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}