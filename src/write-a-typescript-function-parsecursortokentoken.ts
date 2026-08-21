// bloom-deps:
import * as crypto from 'crypto';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    Object.getPrototypeOf(v) === Object.prototype
  );
}

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

  // Parse outer JSON
  let payload: unknown;
  try {
    payload = JSON.parse(decoded);
  } catch {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  if (
    !isPlainObject(payload) ||
    typeof payload['sig'] !== 'string' ||
    typeof payload['data'] !== 'string'
  ) {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  const { sig, data } = payload as { sig: string; data: string };

  // Recompute HMAC-SHA256
  const computed = crypto.createHmac('sha256', secret).update(data).digest('hex');

  // Compare signatures using timingSafeEqual, guarding length mismatch
  const computedBuf = Buffer.from(computed, 'hex');
  const sigBuf = Buffer.from(sig, 'hex');

  if (computedBuf.length !== sigBuf.length) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  if (!crypto.timingSafeEqual(computedBuf, sigBuf)) {
    throw new SyntaxError('Invalid cursor: signature mismatch');
  }

  // Parse data JSON
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(data);
  } catch {
    throw new SyntaxError('Invalid cursor: malformed payload');
  }

  if (!isPlainObject(parsedData)) {
    throw new SyntaxError('Invalid cursor: data is not a plain object');
  }

  return parsedData;
}