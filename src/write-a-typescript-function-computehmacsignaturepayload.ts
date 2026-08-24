// bloom-deps:

import crypto from 'crypto';

export function computeHmacSignature(payload: unknown, secret: unknown): string {
  // Validate payload
  if (typeof payload !== 'string') {
    throw new TypeError('payload must be a string');
  }
  
  if (payload.length === 0) {
    throw new TypeError('payload must not be empty');
  }
  
  // Validate secret
  if (typeof secret !== 'string') {
    throw new TypeError('secret must be a string');
  }
  
  if (secret.length === 0) {
    throw new TypeError('secret must not be empty');
  }
  
  // Compute HMAC-SHA256
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  
  return digest.toLowerCase();
}