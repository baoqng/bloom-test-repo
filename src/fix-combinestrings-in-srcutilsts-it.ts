// bloom-deps:

export function combineStrings(parts: unknown, separator: unknown): string {
  if (parts === null || parts === undefined) {
    throw new TypeError('parts is required');
  }
  if (!Array.isArray(parts)) {
    throw new TypeError('parts must be an Array');
  }
  if (separator === null || separator === undefined) {
    throw new TypeError('separator is required');
  }
  if (typeof separator !== 'string') {
    throw new TypeError('separator must be a string');
  }
  for (const element of parts) {
    if (element === null || element === undefined) {
      throw new TypeError('parts contains null or undefined element');
    }
    if (typeof element !== 'string') {
      throw new TypeError('all elements must be strings');
    }
  }
  return (parts as string[]).join(separator);
}