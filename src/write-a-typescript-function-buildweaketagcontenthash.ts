// bloom-deps:

export function buildWeakETag(contentHash: unknown, version: unknown): string {
  if (typeof contentHash !== 'string' || contentHash.length === 0) {
    throw new TypeError('contentHash must be a non-empty string');
  }

  if (
    typeof version !== 'number' ||
    !isFinite(version) ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    throw new TypeError('version must be a non-negative integer');
  }

  if (!/^[0-9a-fA-F]+$/.test(contentHash)) {
    throw new RangeError('contentHash must contain only hexadecimal characters');
  }

  const lowerHash = contentHash.toLowerCase();
  return `W/"${lowerHash}-${version}"`;
}