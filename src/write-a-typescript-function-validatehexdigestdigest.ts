// bloom-deps:

function validateHexDigest(digest: unknown, bitLength: unknown): string {
  if (typeof digest !== "string") {
    throw new TypeError("digest must be a string");
  }

  if (
    typeof bitLength !== "number" ||
    !isFinite(bitLength) ||
    !Number.isInteger(bitLength) ||
    bitLength <= 0
  ) {
    throw new TypeError("bitLength must be a positive integer");
  }

  if (bitLength % 4 !== 0) {
    throw new RangeError("bitLength must be a multiple of 4");
  }

  if (bitLength > 1024) {
    throw new RangeError("bitLength must not exceed 1024");
  }

  const trimmed = digest.trim().toLowerCase();
  const expectedLength = bitLength / 4;

  if (trimmed.length === 0) {
    throw new RangeError("digest must be empty");
  }

  if (trimmed.length !== expectedLength) {
    throw new RangeError(`digest must be exactly ${expectedLength} characters`);
  }

  if (!/^[0-9a-f]+$/.test(trimmed)) {
    throw new RangeError("digest must contain only hexadecimal characters");
  }

  return trimmed;
}

export { validateHexDigest };