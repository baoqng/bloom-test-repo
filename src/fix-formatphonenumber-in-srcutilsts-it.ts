// bloom-deps:

export function formatPhoneNumber(digits: unknown): string {
  if (digits === null || digits === undefined) {
    throw new TypeError('digits is required');
  }
  if (typeof digits !== 'string') {
    throw new TypeError('digits must be a string');
  }
  if (!/^\d+$/.test(digits)) {
    throw new TypeError('digits must contain only numeric characters');
  }
  if (digits.length !== 10) {
    throw new RangeError('digits must be exactly 10 characters');
  }
  return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
}