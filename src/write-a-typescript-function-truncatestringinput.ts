// bloom-deps:

export function truncateString(input: unknown, maxBytes: unknown, suffix: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (typeof maxBytes !== 'number' || !Number.isFinite(maxBytes)) {
    throw new TypeError('maxBytes must be a finite number');
  }
  if (typeof suffix !== 'string') {
    throw new TypeError('suffix must be a string');
  }
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) {
    throw new RangeError('maxBytes must be a positive integer');
  }

  const suffixByteLength = Buffer.byteLength(suffix, 'utf8');
  if (suffixByteLength > maxBytes) {
    throw new RangeError('UTF-8 byte length of suffix exceeds maxBytes');
  }

  const inputByteLength = Buffer.byteLength(input, 'utf8');
  if (inputByteLength <= maxBytes) {
    return input;
  }

  // Need to truncate: find longest prefix such that byteLength(prefix) + byteLength(suffix) <= maxBytes
  const availableBytes = maxBytes - suffixByteLength;

  // Binary search or character-by-character approach
  // We need to be careful with multi-byte characters
  // Use a character-by-character approach to find the longest valid prefix
  let low = 0;
  let high = input.length;
  let result = 0;

  // Binary search on character count
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const prefixByteLength = Buffer.byteLength(input.slice(0, mid), 'utf8');
    if (prefixByteLength <= availableBytes) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return input.slice(0, result) + suffix;
}