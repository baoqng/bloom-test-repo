// bloom-deps: crypto

import crypto from 'crypto';

function parseCursorToken(token: unknown, secret: unknown): Record<string, unknown> {
  // Validate token parameter
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  // Validate secret parameter
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  // Base64url decode the token
  let decoded: string;
  try {
    // Replace base64url characters with standard base64 characters
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    // Pad to multiple of 4
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    // Decode from base64 to utf8
    decoded = Buffer.from(padded, 'base64').toString('utf8');
  } catch (error) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  // Parse the decoded payload as JSON
  let payload: unknown;
  try {
    payload = JSON.parse(decoded);
  } catch (error) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  // Validate payload is a plain object with sig and data fields
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload) ||
    Object.getPrototypeOf(payload) !== Object.prototype
  ) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  const payloadObj = payload as Record<string, unknown>;
  if (typeof payloadObj.sig !== 'string' || typeof payloadObj.data !== 'string') {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  const { sig, data } = payloadObj;

  // Recompute HMAC-SHA256 of payload.data using secret
  const computedHmac = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  // Compare signatures using timing-safe comparison
  const computedBuffer = Buffer.from(computedHmac, 'hex');
  const providedBuffer = Buffer.from(sig, 'hex');

  // Check if lengths differ first
  if (computedBuffer.length !== providedBuffer.length) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  // Use timing-safe comparison
  if (!crypto.timingSafeEqual(computedBuffer, providedBuffer)) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  // Parse payload.data as JSON
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  // Validate parsed data is a plain object
  if (
    typeof parsedData !== 'object' ||
    parsedData === null ||
    Array.isArray(parsedData) ||
    Object.getPrototypeOf(parsedData) !== Object.prototype
  ) {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  return parsedData as Record<string, unknown>;
}

export { parseCursorToken };