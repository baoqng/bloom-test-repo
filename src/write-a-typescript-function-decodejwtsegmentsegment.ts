// bloom-deps:

function decodeJwtSegment(segment: unknown): Record<string, unknown> {
  if (typeof segment !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Strip trailing '=' padding characters
  const stripped = segment.replace(/=+$/, '');

  // Validate that only [A-Za-z0-9_-] characters remain
  if (!/^[A-Za-z0-9_\-]*$/.test(stripped)) {
    throw new SyntaxError('Invalid base64url encoding');
  }

  // Convert base64url to standard base64
  let base64 = stripped.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if necessary
  const padLength = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padLength);

  // Decode base64 to string
  let decoded: string;
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    decoded = new TextDecoder('utf-8').decode(bytes);
  } catch {
    throw new SyntaxError('Invalid base64url encoding');
  }

  // Parse as JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new SyntaxError('Segment is not valid JSON');
  }

  // Validate it's a plain object (not null, not array, not primitive)
  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new SyntaxError('Segment must decode to an object');
  }

  return parsed as Record<string, unknown>;
}

export { decodeJwtSegment };