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

  // Validate suffix does not exceed maxBytes alone
  if (suffixByteLength > maxBytes) {
    throw new RangeError('suffix byte length exceeds maxBytes');
  }

  // If input already fits, return unchanged
  if (inputByteLength <= maxBytes) {
    return input;
  }

  // Truncation needed: find the longest prefix such that
  // byteLength(prefix) + byteLength(suffix) <= maxBytes
  const maxPrefixBytes = maxBytes - suffixByteLength;
  
  let prefixByteLength = 0;
  let prefixCharIndex = 0;

  // Iterate through input string, counting UTF-8 bytes
  for (let i = 0; i < input.length; i++) {
    const charByteLength = Buffer.byteLength(input[i], 'utf8');
    
    // Check if adding this character would exceed the limit
    if (prefixByteLength + charByteLength > maxPrefixBytes) {
      break;
    }
    
    prefixByteLength += charByteLength;
    prefixCharIndex = i + 1;
  }

  // Return the prefix plus the suffix
  return input.slice(0, prefixCharIndex) + suffix;
}

export { truncateString };