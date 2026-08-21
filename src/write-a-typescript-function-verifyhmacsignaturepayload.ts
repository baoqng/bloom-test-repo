// bloom-deps:

export function verifyHmacSignature(
  payload: unknown,
  signature: unknown,
  secret: string,
  crypto: {
    createHmac: (alg: string, key: string) => {
      update: (data: string) => {
        digest: (enc: string) => string;
      };
    };
  }
): boolean {
  // Validate payload is a string
  if (typeof payload !== 'string') {
    throw new TypeError('payload must be a string');
  }

  // Validate signature is a string
  if (typeof signature !== 'string') {
    throw new TypeError('signature must be a string');
  }

  // Validate secret is a non-empty string
  if (typeof secret !== 'string' || secret === '') {
    throw new TypeError('secret must be a non-empty string');
  }

  // Compute HMAC-SHA256
  const computed = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Constant-time comparison: compare character by character
  // regardless of where they first differ
  if (computed.length !== signature.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < computed.length; i++) {
    if (computed[i] !== signature[i]) {
      mismatch++;
    }
  }

  return mismatch === 0;
}