// bloom-deps:
import * as crypto from 'crypto';

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  options?: { algorithm?: 'sha256' | 'sha512'; headerPrefix?: string }
): boolean {
  // Type validation - throw TypeError for wrong types
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

    // Strip prefix from signature
    let normalizedSignature = signature;

    // Strip known algorithm prefixes like 'sha256=' or 'sha512='
    const algorithmPrefixPattern = /^(sha\d+)=/i;
    const prefixMatch = normalizedSignature.match(algorithmPrefixPattern);
    if (prefixMatch) {
      normalizedSignature = normalizedSignature.slice(prefixMatch[0].length);
    }

    // Strip custom headerPrefix if provided
    if (options?.headerPrefix) {
      if (normalizedSignature.startsWith(options.headerPrefix)) {
        normalizedSignature = normalizedSignature.slice(options.headerPrefix.length);
      }
    }

    // Validate that the normalized signature is a valid hex string
    if (!/^[0-9a-fA-F]+$/.test(normalizedSignature)) {
      return false;
    }

    // Compute HMAC
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payload);
    const digest = hmac.digest('hex');

    // Convert both to buffers for timing-safe comparison
    let signatureBuffer: Buffer;
    let digestBuffer: Buffer;

    try {
      signatureBuffer = Buffer.from(normalizedSignature, 'hex');
      digestBuffer = Buffer.from(digest, 'hex');
    } catch {
      return false;
    }

    // If lengths differ, comparison would throw - return false
    if (signatureBuffer.length !== digestBuffer.length) {
      return false;
    }

    // If either buffer is empty (malformed), return false
    if (signatureBuffer.length === 0 || digestBuffer.length === 0) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
  } catch (error) {
    // Return false for any comparison failures or malformed signatures
    // (as per contract: malformed_signature -> return_false, comparison_fails -> return_false)
    if (error instanceof TypeError) {
      // Re-throw TypeErrors that we explicitly threw for type validation
      throw error;
    }
    return false;
  }
}