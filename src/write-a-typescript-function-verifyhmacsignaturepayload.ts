// bloom-deps:

function verifyHmacSignature(
  payload: unknown,
  signature: unknown,
  secret: string,
  crypto: { createHmac: (alg: string, key: string) => { update: (data: string) => { digest: (enc: string) => string } } }
): boolean {
  if (typeof payload !== 'string') {
    throw new TypeError('payload must be a string');
  }
  if (typeof signature !== 'string') {
    throw new TypeError('signature must be a string');
  }
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  // Constant-time comparison: character-by-character, independent of first differing position
  const a = computed;
  const b = signature;

  const len = Math.max(a.length, b.length);
  let result = a.length === b.length ? 0 : 1;

  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }

  return result === 0;
}

export { verifyHmacSignature };