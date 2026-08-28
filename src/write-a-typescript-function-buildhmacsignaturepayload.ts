// bloom-deps:
import { createHmac } from 'crypto';

export function buildHmacSignature(payload: unknown, secret: unknown, algorithm: unknown): string {
  if (typeof payload !== 'string' || payload.length === 0) {
    throw new TypeError('payload must be a non-empty string');
  }
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }
  if (algorithm !== 'sha256' && algorithm !== 'sha512') {
    throw new TypeError("algorithm must be 'sha256' or 'sha512'");
  }

  const hmac = createHmac(algorithm, Buffer.from(secret));
  hmac.update(payload);
  return hmac.digest('hex').toLowerCase();
}