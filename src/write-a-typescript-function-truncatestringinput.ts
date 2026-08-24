// bloom-deps:

function truncateString(input: unknown, maxBytes: unknown, suffix: unknown): string {
  // Validate input is a string
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  // Validate maxBytes is a finite number
  if (typeof maxBytes !== 'number' || !isFinite(maxBytes)) {
    throw new TypeError('maxBytes must be a finite number');
  }

  // Validate suffix is a string
  if (typeof suffix !== 'string') {
    throw new TypeError('suffix must be a string');
  }

  // Validate maxBytes is a positive integer
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) {
    throw new RangeError('maxBytes must be a positive integer');
  }

  // Calculate byte lengths
  const suffixByteLength = Buffer.byteLength(suffix, 'utf8');
  const inputByteLength = Buffer.byteLength(input, 'utf8');

  // Validate suffix does not exceed maxBytes
  if (suffixByteLength > maxBytes) {
    throw new RangeError('suffix byte length exceeds maxBytes');
  }

  // If input already fits, return unchanged
  if (inputByteLength <= maxBytes) {
    return input;
  }

  // Need to truncate: find longest prefix such that
  // byteLength(prefix) + byteLength(suffix) <= maxBytes
  const availableBytes = maxBytes - suffixByteLength;

  let truncated = '';
  let currentByteLength = 0;

  // Iterate through the input string character by character
  for (const char of input) {
    const charByteLength = Buffer.byteLength(char, 'utf8');
    if (currentByteLength + charByteLength <= availableBytes) {
      truncated += char;
      currentByteLength += charByteLength;
    } else {
      break;
    }
  }

  return truncated + suffix;
}

export { truncateString };