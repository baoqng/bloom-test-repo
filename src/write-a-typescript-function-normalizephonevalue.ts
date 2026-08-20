// bloom-deps:

function normalizePhone(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError('Expected string');
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length < 7) {
    throw new RangeError('Phone number must have at least 7 digits');
  }

  return digits;
}

export { normalizePhone };