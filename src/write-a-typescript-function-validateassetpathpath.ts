// bloom-deps:

function validateAssetPath(path: unknown): string {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  if (path.trim().length === 0) {
    throw new RangeError('path must not be empty');
  }

  const trimmed = path.trim();

  if (trimmed.includes('\x00')) {
    throw new RangeError('path must not contain null bytes');
  }

  if (trimmed.startsWith('/') || /^[A-Za-z]:\\/.test(trimmed)) {
    throw new RangeError('path must not be absolute');
  }

  const segments = trimmed.split(/[/\\]/);
  for (const segment of segments) {
    if (segment === '..') {
      throw new RangeError('path must not contain directory traversal sequences');
    }
  }

  if (/[^A-Za-z0-9\-_./\\]/.test(trimmed)) {
    throw new RangeError('path must contain only valid path characters');
  }

  return trimmed;
}

export { validateAssetPath };