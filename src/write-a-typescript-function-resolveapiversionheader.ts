// bloom-deps:

function resolveApiVersion(header: string | null, supported: string[]): string {
  // Validate supported array
  if (!Array.isArray(supported) || supported.length === 0) {
    throw new TypeError('supported must be a non-empty array of non-empty strings');
  }
  for (const s of supported) {
    if (typeof s !== 'string' || s.length === 0) {
      throw new TypeError('supported must be a non-empty array of non-empty strings');
    }
  }

  // Handle null or empty header
  if (header === null) {
    return supported[supported.length - 1];
  }

  const trimmed = header.trim();

  if (trimmed.length === 0) {
    return supported[supported.length - 1];
  }

  // Strip leading 'v' or 'V'
  let stripped = trimmed;
  if (stripped.length > 0 && (stripped[0] === 'v' || stripped[0] === 'V')) {
    stripped = stripped.slice(1);
  }

  // Match against supported (case-sensitive)
  for (const s of supported) {
    if (s === stripped) {
      return s;
    }
  }

  // Not found
  throw new RangeError('Unsupported API version: ' + header);
}

export { resolveApiVersion };