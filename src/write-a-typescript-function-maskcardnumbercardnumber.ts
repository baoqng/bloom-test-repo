// bloom-deps:

function maskCardNumber(cardNumber: unknown, visibleDigits?: number): string {
  if (typeof cardNumber !== 'string') {
    throw new TypeError('cardNumber must be a string');
  }

  const stripped = cardNumber.replace(/[\s-]/g, '');

  if (!/^\d{12,19}$/.test(stripped)) {
    throw new RangeError('cardNumber must contain 12 to 19 digits');
  }

  const digits = visibleDigits !== undefined ? visibleDigits : 4;

  if (visibleDigits !== undefined) {
    if (!Number.isInteger(visibleDigits) || visibleDigits < 1 || visibleDigits > 8) {
      throw new RangeError('visibleDigits must be an integer between 1 and 8');
    }
  }

  const maskLength = stripped.length - digits;
  const masked = '•'.repeat(maskLength) + stripped.slice(maskLength);

  return masked;
}

export { maskCardNumber };