// bloom-deps:

export function validateMimeTypeString(mimeType: unknown): { type: string; subtype: string; full: string } {
  if (typeof mimeType !== 'string') {
    throw new TypeError('mimeType must be a string');
  }

  if (!mimeType.trim()) {
    throw new RangeError('mimeType must not be empty');
  }

  const normalized = mimeType.trim().toLowerCase();

  const slashCount = normalized.split('/').length - 1;
  if (slashCount !== 1) {
    throw new RangeError("mimeType must contain exactly one '/' character");
  }

  const slashIndex = normalized.indexOf('/');
  const type = normalized.substring(0, slashIndex);
  const subtype = normalized.substring(slashIndex + 1);

  if (type === '') {
    throw new RangeError('type must not be empty');
  }

  if (subtype === '') {
    throw new RangeError('subtype must not be empty');
  }

  if (!/^[a-z0-9\-]+$/.test(type)) {
    throw new RangeError('type must contain only letters, digits, and hyphens');
  }

  if (!/^[a-z0-9\-\.+]+$/.test(subtype)) {
    throw new RangeError('type must contain only letters, digits, hyphens, dots, and plus signs'.replace('type', 'subtype'));
  }

  if (type.startsWith('-') || type.endsWith('-')) {
    throw new RangeError('type must not start or end with a hyphen');
  }

  return { type, subtype, full: type + '/' + subtype };
}