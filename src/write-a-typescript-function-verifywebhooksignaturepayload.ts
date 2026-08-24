// bloom-deps:
import * as crypto from 'crypto';

function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  options?: { algorithm?: 'sha256' | 'sha512'; headerPrefix?: string }
): boolean {
  // Validate parameter types
  if (typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
    throw new TypeError('payload must be a string or Buffer');
  }
  if (typeof signature !== 'string') {
    throw new TypeError('signature must be a string');
  }
  if (typeof secret !== 'string') {
    throw new TypeError('secret must be a string');
  }

  try {
    const algorithm = options?.algorithm ?? 'sha256';

    // Normalize the signature by stripping any known prefix
    let normalizedSignature = signature;

    // Strip headerPrefix if provided
    if (options?.headerPrefix && normalizedSignature.startsWith(options.headerPrefix)) {
      normalizedSignature = normalizedSignature.slice(options.headerPrefix.length);
    } else {
      // Strip common algorithm prefixes like 'sha256=', 'sha512='
      const prefixMatch = normalizedSignature.match(/^(sha256=|sha512=)(.*)/);
      if (prefixMatch) {
        normalizedSignature = prefixMatch[2];
      }
    }

    // Validate that the normalized signature looks like valid hex
    if (!/^[0-9a-fA-F]+$/.test(normalizedSignature)) {
      return false;
    }

    // Compute the expected HMAC
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payload);
    const digest = hmac.digest('hex');

    // Convert both to Buffers for timing-safe comparison
    const digestBuffer = Buffer.from(digest, 'hex');
    const signatureBuffer = Buffer.from(normalizedSignature, 'hex');

    // Buffers must be the same length for timingSafeEqual
    if (digestBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  } catch {
    // Any unexpected error (e.g., malformed input) results in false
    return false;
  }
}

export { verifyWebhookSignature };