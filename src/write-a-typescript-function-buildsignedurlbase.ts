// bloom-deps: crypto@latest

import { createHmac } from 'crypto';

export function buildSignedURL(base: unknown, secret: unknown, expiresAt: unknown): string {
  // Validate base
  if (typeof base !== 'string') {
    throw new TypeError('base must be a non-empty string');
  }
  if (base.length === 0) {
    throw new TypeError('base must be a non-empty string');
  }

  // Validate secret
  if (typeof secret !== 'string') {
    throw new TypeError('secret must be a non-empty string');
  }
  if (secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  // Validate expiresAt
  if (!Number.isInteger(expiresAt)) {
    throw new TypeError('expiresAt must be a finite positive integer');
  }
  if (!Number.isFinite(expiresAt)) {
    throw new TypeError('expiresAt must be a finite positive integer');
  }
  if (expiresAt <= 0) {
    throw new TypeError('expiresAt must be a finite positive integer');
  }

  // Build payload to sign
  const payload = `${base}?expires=${expiresAt}`;

  // Compute HMAC-SHA256
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const hexSignature = hmac.digest('hex');

  // Return final URL
  return `${base}?expires=${expiresAt}&sig=${hexSignature}`;
}