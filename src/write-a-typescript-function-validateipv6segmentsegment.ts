// bloom-deps:

export function validateIPv6Segment(segment: unknown): number {
  if (typeof segment !== 'string') {
    throw new TypeError('segment must be a string');
  }

  if (segment.trim().length === 0) {
    throw new RangeError('segment must not be empty');
  }

  const trimmed = segment.trim();

  if (trimmed.length < 1 || trimmed.length > 4) {
    throw new RangeError('segment must be between 1 and 4 characters');
  }

  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    throw new RangeError('segment must contain only hexadecimal characters');
  }

  const value = parseInt(trimmed, 16);

  if (value < 0 || value > 65535) {
    throw new RangeError('segment value must be between 0 and 65535');
  }

  return value;
}