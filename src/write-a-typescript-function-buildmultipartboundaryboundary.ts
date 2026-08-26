// bloom-deps:

export function buildMultipartBoundary(boundary: unknown): { contentType: string; boundary: string } {
  if (typeof boundary !== 'string') {
    throw new TypeError('boundary must be a string');
  }

  if (boundary.trim().length === 0) {
    throw new RangeError('boundary must not be empty');
  }

  const trimmed = boundary.trimStart();

  if (trimmed.length < 1 || trimmed.length > 70) {
    throw new RangeError('boundary must be between 1 and 70 characters');
  }

  if (trimmed.endsWith(' ')) {
    throw new RangeError('boundary must not end with a space');
  }

  const validChars = /^[A-Za-z0-9 '()+_,\-.\/:=?]+$/;
  if (!validChars.test(trimmed)) {
    throw new RangeError('boundary must contain only valid characters');
  }

  return {
    contentType: 'multipart/form-data; boundary=' + trimmed,
    boundary: trimmed,
  };
}