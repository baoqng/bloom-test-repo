// bloom-deps:

function parseMultipartBoundary(contentType: unknown): string {
  if (typeof contentType !== 'string' || contentType.length === 0) {
    throw new TypeError('contentType must be a non-empty string');
  }

  // Extract type portion before first semicolon using indexOf+slice
  const firstSemi = contentType.indexOf(';');
  const typePortion = firstSemi === -1
    ? contentType.trim()
    : contentType.slice(0, firstSemi).trim();

  const typeLower = typePortion.toLowerCase();
  if (typeLower !== 'multipart/form-data' && typeLower !== 'multipart/mixed') {
    throw new SyntaxError('Not a multipart content type');
  }

  // Parse parameters from the remainder after the first semicolon
  if (firstSemi === -1) {
    throw new SyntaxError('Missing boundary parameter');
  }

  const paramsString = contentType.slice(firstSemi + 1);
  const paramSegments = paramsString.split(';');

  let boundary: string | null = null;

  for (const segment of paramSegments) {
    const trimmedSegment = segment.trim();
    if (trimmedSegment.length === 0) continue;

    // Find '=' using indexOf to split on first occurrence only
    const eqIndex = trimmedSegment.indexOf('=');
    if (eqIndex === -1) continue;

    const paramName = trimmedSegment.slice(0, eqIndex).trim().toLowerCase();
    const paramValue = trimmedSegment.slice(eqIndex + 1).trim();

    if (paramName === 'boundary') {
      // Handle quoted or unquoted value
      if (paramValue.startsWith('"') && paramValue.endsWith('"') && paramValue.length >= 2) {
        boundary = paramValue.slice(1, -1);
      } else {
        boundary = paramValue;
      }
      break;
    }
  }

  if (boundary === null) {
    throw new SyntaxError('Missing boundary parameter');
  }

  // Validate boundary length
  if (boundary.length === 0 || boundary.length > 70) {
    throw new RangeError('Boundary must be 1-70 characters');
  }

  // Validate boundary characters: alphanumeric, space, '(', ')', '+', '-', '.', '/', ':', '=', '?'
  if (/[^A-Za-z0-9 ()+\-./:=?]/.test(boundary)) {
    throw new RangeError('Boundary contains invalid characters');
  }

  return boundary;
}

export { parseMultipartBoundary };