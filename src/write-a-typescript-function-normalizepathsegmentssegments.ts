// bloom-deps:

export function normalizePathSegments(segments: unknown): string[] {
  if (!Array.isArray(segments)) {
    throw new TypeError('segments must be an array');
  }

  for (const element of segments) {
    if (typeof element !== 'string') {
      throw new TypeError('all elements must be strings');
    }
    if (element.includes('\0')) {
      throw new RangeError('segment contains a null byte');
    }
  }

  const result: string[] = [];

  for (const segment of segments as string[]) {
    const trimmed = segment.replace(/^\/+|\/+$/g, '');

    if (trimmed === '..') {
      if (result.length > 0) {
        result.pop();
      }
      continue;
    }

    if (trimmed === '' || /^\.+$/.test(trimmed)) {
      continue;
    }

    result.push(trimmed);
  }

  return result;
}