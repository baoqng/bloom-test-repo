// bloom-deps:
import { createHmac } from 'crypto';

export function buildSignedURL(base: unknown, secret: unknown, expiresAt: unknown): string {
  if (typeof base !== 'string' || base.length === 0) {
    throw new TypeError('base must be a non-empty string');
  }

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  if (
    typeof expiresAt !== 'number' ||
    !Number.isFinite(expiresAt) ||
    !Number.isInteger(expiresAt) ||
    expiresAt <= 0
  ) {
    throw new TypeError('expiresAt must be a finite positive integer');
  }

  const payload = `${base}?expires=${expiresAt}`;
  const hexSignature = createHmac('sha256', secret).update(payload).digest('hex');

  return `${base}?expires=${expiresAt}&sig=${hexSignature}`;
}