// bloom-deps:

export function validateResourceName(value: unknown): void {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const normalised = value.trim().toLowerCase();

  if (normalised.length < 3) {
    throw new RangeError('name too short');
  }

  if (normalised.length > 63) {
    throw new RangeError('name too long');
  }

  if (!/^[a-z]/.test(normalised)) {
    throw new SyntaxError('must start with letter');
  }

  if (/[^a-z0-9-]/.test(normalised)) {
    throw new SyntaxError('invalid characters');
  }

  if (normalised.endsWith('-')) {
    throw new SyntaxError('must not end with hyphen');
  }
}