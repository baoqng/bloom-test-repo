// bloom-deps:

export function validateFieldPath(path: unknown): string {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  if (path.length === 0) {
    throw new RangeError('path must not be empty');
  }

  const segments = path.split('.');

  for (const segment of segments) {
    if (segment.length === 0) {
      throw new RangeError('path must not have empty segments');
    }

    const firstChar = segment[0];
    if (firstChar >= '0' && firstChar <= '9') {
      throw new RangeError('path segment must start with a letter or underscore');
    }

    for (let i = 0; i < segment.length; i++) {
      const ch = segment[i];
      const isLetter = (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
      const isDigit = ch >= '0' && ch <= '9';
      const isUnderscore = ch === '_';
      if (!isLetter && !isDigit && !isUnderscore) {
        throw new RangeError('path segment contains invalid characters');
      }
    }
  }

  return path;
}