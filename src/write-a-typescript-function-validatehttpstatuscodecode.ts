// bloom-deps:

export function validateHttpStatusCode(code: unknown): number {
  if (typeof code !== 'number' || Number.isNaN(code)) {
    throw new TypeError('code must be a number');
  }

  if (!Number.isFinite(code) || !Number.isInteger(code)) {
    throw new RangeError('code must be a finite integer');
  }

  if (code < 100 || code > 599) {
    throw new RangeError('code must be between 100 and 599');
  }

  return code;
}