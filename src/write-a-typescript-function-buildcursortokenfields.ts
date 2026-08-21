// bloom-deps:
import { createHmac } from 'crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildCursorToken(fields: Record<string, unknown>, secret: string): string {
  if (!isPlainObject(fields)) {
    throw new TypeError('fields must be a plain object');
  }

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  const json = JSON.stringify(fields);

  const hmac = createHmac('sha256', secret);
  hmac.update(json);
  const sig = hmac.digest('hex');

  const payload = { sig, data: json };
  const payloadJson = JSON.stringify(payload);

  const base64 = Buffer.from(payloadJson).toString('base64');
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return base64url;
}