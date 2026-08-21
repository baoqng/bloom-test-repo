// bloom-deps:

function encodeBase64Url(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  if (input.length === 0) {
    return '';
  }

  const base64 = Buffer.from(input, 'utf8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export { encodeBase64Url };