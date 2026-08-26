// bloom-deps:

function validateChecksumHex(hex: unknown, algorithm: unknown): string {
  if (typeof hex !== 'string') {
    throw new TypeError('hex must be a string');
  }
  if (typeof algorithm !== 'string') {
    throw new TypeError('algorithm must be a string');
  }

  if (hex.trim().length === 0) {
    throw new RangeError('hex must not be empty');
  }
  if (algorithm.trim().length === 0) {
    throw new RangeError('algorithm must not be empty');
  }

  const trimmedHex = hex.trim();
  const normalizedAlgorithm = algorithm.trim().toLowerCase();

  const supportedAlgorithms: Record<string, number> = {
    md5: 32,
    sha1: 40,
    sha256: 64,
    sha384: 96,
    sha512: 128,
  };

  if (!(normalizedAlgorithm in supportedAlgorithms)) {
    throw new RangeError('unsupported algorithm');
  }

  const expectedLength = supportedAlgorithms[normalizedAlgorithm];

  if (trimmedHex.length !== expectedLength) {
    throw new RangeError(`hex length must be ${expectedLength} for ${normalizedAlgorithm}`);
  }

  if (!/^[0-9a-fA-F]+$/.test(trimmedHex)) {
    throw new RangeError('hex must contain only hexadecimal characters');
  }

  return trimmedHex.toLowerCase();
}

export { validateChecksumHex };