// bloom-deps:

function buildOAuthState(redirectUri: unknown, nonce: unknown, metadata: unknown): string {
  // Validate redirectUri
  if (typeof redirectUri !== 'string' || redirectUri.length === 0) {
    throw new TypeError('redirectUri must be a non-empty string');
  }

  // Validate nonce
  if (typeof nonce !== 'string' || nonce.length === 0) {
    throw new TypeError('nonce must be a non-empty string');
  }

  // Validate metadata is a plain object
  if (!isPlainObject(metadata)) {
    throw new TypeError('metadata must be a plain object');
  }

  // Get current Unix timestamp in seconds
  const iat = Math.floor(Date.now() / 1000);

  // Build payload object
  const payload = {
    redirectUri,
    nonce,
    metadata,
    iat,
  };

  // Serialize to JSON
  const jsonString = JSON.stringify(payload);

  // Encode to base64url (URL-safe base64 without padding)
  const base64Encoded = Buffer.from(jsonString, 'utf-8').toString('base64');
  const base64url = base64Encoded
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return base64url;
}

function isPlainObject(obj: unknown): boolean {
  // Check all four: null, typeof, Array, and getPrototypeOf
  if (obj === null) {
    return false;
  }

  if (typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return false;
  }

  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(obj);
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

export { buildOAuthState };