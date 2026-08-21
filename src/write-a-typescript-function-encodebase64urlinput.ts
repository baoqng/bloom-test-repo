// bloom-deps:

function encodeBase64Url(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (input === '') {
    return '';
  }
  const buffer = Buffer.alloc(input.length);
  for (let i = 0; i < input.length; i++) {
    buffer[i] = input.charCodeAt(i);
  }
  const base64 = buffer.toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export { encodeBase64Url };