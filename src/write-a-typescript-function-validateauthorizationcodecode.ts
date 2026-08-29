// bloom-deps:

function validateAuthorizationCode(code: string, state: string | null, expectedState: string | null): void {
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }

  if (code.length < 16 || code.length > 512) {
    throw new RangeError('Authorization code must be 16 to 512 characters');
  }

  if (/[^A-Za-z0-9_.\-]/.test(code)) {
    throw new TypeError('Authorization code must contain only URL-safe characters');
  }

  if (expectedState !== null && expectedState !== '') {
    if (state === null || state.trim() === '') {
      throw new TypeError('state parameter is required');
    }

    if (state !== expectedState) {
      throw new RangeError('state parameter does not match expected value');
    }
  }
}

export { validateAuthorizationCode };