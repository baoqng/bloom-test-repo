// bloom-deps:

export function parseDottedPath(path: unknown): string[] {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  if (path === '') {
    throw new SyntaxError('Path must be a non-empty string');
  }

  const segments: string[] = [];
  let remaining = path;
  let segmentIndex = 0;

  while (true) {
    const dotIndex = remaining.indexOf('.');
    if (dotIndex === -1) {
      // Last segment
      if (remaining === '') {
        throw new SyntaxError(`Invalid path: empty segment at position ${segmentIndex}`);
      }
      segments.push(remaining);
      break;
    } else {
      const segment = remaining.slice(0, dotIndex);
      if (segment === '') {
        throw new SyntaxError(`Invalid path: empty segment at position ${segmentIndex}`);
      }
      segments.push(segment);
      remaining = remaining.slice(dotIndex + 1);
      segmentIndex++;
    }
  }

  return segments;
}