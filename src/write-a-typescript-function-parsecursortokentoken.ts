// bloom-deps:
import * as crypto from 'crypto';

export function parseCursorToken(token: unknown, secret: string): Record<string, unknown> {
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  // base64url-decode
  let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const decoded = Buffer.from(base64, 'base64').toString('utf8');

  // Parse outer JSON and validate sig/data fields
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
    typeof (payload as Record<string, unknown>)['sig'] !== 'string' ||
    typeof (payload as Record<string, unknown>)['data'] !== 'string'
  ) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  const { sig, data } = payload as { sig: string; data: string };

  // Recompute HMAC-SHA256
  const computedDigest = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  // Compare using timingSafeEqual; handle length mismatch
  if (computedDigest.length !== sig.length) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  const computedBuf = Buffer.from(computedDigest, 'utf8');
  const sigBuf = Buffer.from(sig, 'utf8');

  if (!crypto.timingSafeEqual(computedBuf, sigBuf)) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  // Parse inner data JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  // Validate plain object
  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed) ||
    Object.getPrototypeOf(parsed) !== Object.prototype
  ) {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  return parsed as Record<string, unknown>;
}