// bloom-deps:
import { createHash } from 'crypto';

export function computeContentDigest(algorithm: unknown, bodyBase64: unknown): string {
  if (typeof algorithm !== 'string') {
    throw new TypeError('algorithm must be a string');
  }

  const normalizedAlgorithm = algorithm.trim().toLowerCase();
  if (normalizedAlgorithm !== 'sha-256' && normalizedAlgorithm !== 'sha-512') {
    throw new RangeError("algorithm must be 'sha-256' or 'sha-512'");
  }

  if (typeof bodyBase64 !== 'string') {
    throw new TypeError('bodyBase64 must be a string');
  }

  // Validate base64 characters
  const validBase64Chars = /^[A-Za-z0-9+/=]*$/;
  if (!validBase64Chars.test(bodyBase64)) {
    throw new RangeError('bodyBase64 must be valid base64');
  }

  // Validate base64 length: padding can only appear at the end
  // and the total length must be a multiple of 4
  const paddingIndex = bodyBase64.indexOf('=');
  if (paddingIndex !== -1) {
    // If there's padding, everything after first '=' must be '='
    for (let i = paddingIndex; i < bodyBase64.length; i++) {
      if (bodyBase64[i] !== '=') {
        throw new RangeError('bodyBase64 must be valid base64');
      }
    }
  }

  if (bodyBase64.length % 4 !== 0) {
    throw new RangeError('bodyBase64 must be valid base64');
  }

  const decoded = Buffer.from(bodyBase64, 'base64');
  const hash = createHash(normalizedAlgorithm.replace('-', '')).update(decoded).digest('base64');

  return `${normalizedAlgorithm}=:${hash}:`;
}