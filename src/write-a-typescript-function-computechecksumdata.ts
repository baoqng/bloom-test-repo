// bloom-deps: crypto@^1

import { createHash } from 'crypto';

export function computeChecksum(
  data: unknown,
  algorithm: unknown,
  encoding: unknown
): string {
  // Validate data
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
    throw new TypeError('data must be a non-empty string or Buffer');
  }

  if (typeof data === 'string' && data.length === 0) {
    throw new TypeError('data must be a non-empty string or Buffer');
  }

  // Validate algorithm
  const validAlgorithms = ['md5', 'sha1', 'sha256', 'sha512'];
  if (typeof algorithm !== 'string' || !validAlgorithms.includes(algorithm)) {
    throw new TypeError("algorithm must be 'md5', 'sha1', 'sha256', or 'sha512'");
  }

  // Validate encoding
  const validEncodings = ['hex', 'base64', 'base64url'];
  if (typeof encoding !== 'string' || !validEncodings.includes(encoding)) {
    throw new TypeError("encoding must be 'hex', 'base64', or 'base64url'");
  }

  // Create hash
  const hash = createHash(algorithm);

  // Update with data (convert string to UTF-8 Buffer if needed)
  if (typeof data === 'string') {
    hash.update(data, 'utf8');
  } else {
    hash.update(data);
  }

  // Get digest
  if (encoding === 'base64url') {
    // Get base64 digest
    const base64Digest = hash.digest('base64');
    // Convert to URL-safe base64 and remove padding
    const urlSafeDigest = base64Digest
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return urlSafeDigest;
  } else if (encoding === 'hex') {
    return hash.digest('hex');
  } else {
    // encoding === 'base64'
    return hash.digest('base64');
  }
}