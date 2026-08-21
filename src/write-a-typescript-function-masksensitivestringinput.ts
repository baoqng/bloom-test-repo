// bloom-deps:

function maskSensitiveString(input: unknown, visibleChars: number, maskChar?: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  if (!Number.isInteger(visibleChars) || visibleChars < 0 || !isFinite(visibleChars)) {
    throw new RangeError('visibleChars must be a non-negative integer');
  }

  if (maskChar === undefined) {
    maskChar = '*';
  } else {
    if (typeof maskChar !== 'string' || maskChar.length !== 1) {
      throw new TypeError('maskChar must be a single character');
    }
  }

  if (visibleChars >= input.length) {
    return input;
  }

  const maskLength = input.length - visibleChars;
  const maskedPart = maskChar.repeat(maskLength);
  const visiblePart = input.slice(input.length - visibleChars);

  return maskedPart + visiblePart;
}

export { maskSensitiveString };