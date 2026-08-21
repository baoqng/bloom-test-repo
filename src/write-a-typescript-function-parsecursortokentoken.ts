// bloom-deps:
import * as crypto from 'crypto';

export function parseCursorToken(token: unknown, secret: string): Record<string, unknown> {
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  // base64url decode
  let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const decoded = Buffer.from(base64, 'base64').toString('utf8');

  // Parse outer JSON and validate structure
  let payload: unknown;
  try {
    payload = JSON.parse(decoded);
  } catch {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  if (
    payload === null ||
    typeof payload !== 'object' ||
    Array.isArray(payload) ||
    typeof (payload as Record<string, unknown>).sig !== 'string' ||
    typeof (payload as Record<string, unknown>).data !== 'string'
  ) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  const typedPayload = payload as { sig: string; data: string };

  // Recompute HMAC-SHA256
  const computedDigest = crypto
    .createHmac('sha256', secret)
    .update(typedPayload.data)
    .digest('hex');

  // Compare signatures — handle length mismatch without timing-safe comparison
  if (computedDigest.length !== typedPayload.sig.length) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  const computedBuf = Buffer.from(computedDigest, 'utf8');
  const sigBuf = Buffer.from(typedPayload.sig, 'utf8');

  if (!crypto.timingSafeEqual(computedBuf, sigBuf)) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  // Parse inner data JSON
  let data: unknown;
  try {
    data = JSON.parse(typedPayload.data);
  } catch {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  // Validate plain object
  if (
    data === null ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    Object.getPrototypeOf(data) !== Object.prototype
  ) {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  return data as Record<string, unknown>;
}