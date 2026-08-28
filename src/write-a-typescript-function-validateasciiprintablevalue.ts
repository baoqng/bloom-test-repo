// bloom-deps:

function validateAsciiPrintable(value: unknown, fieldName: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }
  if (typeof fieldName !== 'string') {
    throw new TypeError('fieldName must be a string');
  }
  if (fieldName.trim().length === 0) {
    throw new RangeError('fieldName must not be empty');
  }
  if (value.length === 0) {
    throw new RangeError(`${fieldName} must not be empty`);
  }
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) {
      throw new RangeError(`${fieldName} contains non-printable ASCII characters`);
    }
  }
  return value;
}

export { validateAsciiPrintable };