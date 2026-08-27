// bloom-deps:

function buildJwtHeader(algorithm: unknown, keyId?: unknown): string {
  // Step 1: Type check for algorithm
  if (typeof algorithm !== 'string') {
    throw new TypeError('algorithm must be a string');
  }

  // Step 2: Empty/whitespace check for algorithm
  if (!algorithm.trim()) {
    throw new RangeError('algorithm must not be empty');
  }

  // Step 3: Trim algorithm
  const trimmedAlgorithm = algorithm.trim();

  // Step 4: Supported algorithm check
  const supportedAlgorithms = [
    'RS256', 'RS384', 'RS512',
    'ES256', 'ES384', 'ES512',
    'HS256', 'HS384', 'HS512',
  ];

  if (!supportedAlgorithms.includes(trimmedAlgorithm)) {
    throw new RangeError('unsupported algorithm');
  }

  // Step 5: Validate keyId if provided
  let trimmedKeyId: string | undefined;

  if (keyId !== undefined) {
    if (typeof keyId !== 'string') {
      throw new TypeError('keyId must be a string');
    }
    if (!keyId.trim()) {
      throw new RangeError('keyId must not be empty');
    }
    trimmedKeyId = keyId.trim();
  }

  // Step 6: Build header object
  const header: Record<string, string> = {
    alg: trimmedAlgorithm,
    typ: 'JWT',
  };

  if (trimmedKeyId !== undefined) {
    header.kid = trimmedKeyId;
  }

  // Step 7: JSON encode and base64url encode
  const jsonStr = JSON.stringify(header);
  const base64 = Buffer.from(jsonStr, 'utf8').toString('base64');
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64url;
}

export { buildJwtHeader };