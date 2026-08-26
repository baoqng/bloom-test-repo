// bloom-deps:
import { createHash } from 'crypto';

export function computeContentDigest(algorithm: unknown, bodyBase64: unknown): string {
  if (typeof algorithm !== 'string') {
    throw new TypeError("algorithm must be a string");
  }

  const normalizedAlgorithm = algorithm.trim().toLowerCase();
  if (normalizedAlgorithm !== 'sha-256' && normalizedAlgorithm !== 'sha-512') {
    throw new RangeError("algorithm must be 'sha-256' or 'sha-512'");
  }

  if (typeof bodyBase64 !== 'string') {
    throw new TypeError("bodyBase64 must be a string");
  }

  // Check for invalid characters (only A-Z, a-z, 0-9, +, /, = allowed)
  if (!/^[A-Za-z0-9+/=]*$/.test(bodyBase64)) {
    throw new RangeError("bodyBase64 must be valid base64");
  }

  // Base64 length check: total length must be a multiple of 4
  // Per team pattern: use total length % 4, not (length - paddingCount) % 4
  if (bodyBase64.length % 4 !== 0) {
    throw new RangeError("bodyBase64 must be valid base64");
  }

  // Additional validation: padding '=' characters should only appear at the end (up to 2)
  const strippedOnce = bodyBase64.endsWith('=') ? bodyBase64.slice(0, -1) : bodyBase64;
  const strippedTwice = strippedOnce.endsWith('=') ? strippedOnce.slice(0, -1) : strippedOnce;

  // After stripping up to 2 trailing '=', the remaining should not contain '='
  if (strippedTwice.includes('=')) {
    throw new RangeError("bodyBase64 must be valid base64");
  }

  const decoded = Buffer.from(bodyBase64, 'base64');
  const hash = createHash(normalizedAlgorithm).update(decoded).digest('base64');

  return `${normalizedAlgorithm}=:${hash}:`;
}