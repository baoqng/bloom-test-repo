// bloom-deps:

function encodeBase64Url(input: unknown): string {
  if (
    !(typeof input === 'string' && input.length > 0) &&
    !(input instanceof Uint8Array)
  ) {
    throw new TypeError('input must be a non-empty string or Uint8Array');
  }

  let bytes: Uint8Array;

  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input);
  } else {
    bytes = input;
  }

  // Convert bytes to base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = btoa(binary);

  // Convert to URL-safe base64 and strip padding
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return base64url;
}

export { encodeBase64Url };