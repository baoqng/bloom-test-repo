// bloom-deps:

function parseMultipartBoundary(contentType: unknown): string {
  // Guard: contentType must be a non-empty string
  if (typeof contentType !== 'string' || contentType.length === 0) {
    throw new TypeError('contentType must be a non-empty string');
  }

  // Find the first semicolon to split type from parameters
  const semiIndex = contentType.indexOf(';');
  const typePortion = semiIndex === -1 
    ? contentType 
    : contentType.slice(0, semiIndex);

  // Validate multipart type (case-insensitive)
  const normalizedType = typePortion.trim().toLowerCase();
  if (normalizedType !== 'multipart/form-data' && normalizedType !== 'multipart/mixed') {
    throw new SyntaxError('Not a multipart content type');
  }

  // If no semicolon, there are no parameters
  if (semiIndex === -1) {
    throw new SyntaxError('Missing boundary parameter');
  }

  // Extract parameters portion (everything after first semicolon)
  const parametersPortion = contentType.slice(semiIndex + 1);
  
  // Split parameters by semicolon and iterate to find boundary
  const params = parametersPortion.split(';');
  let boundaryValue: string | null = null;

  for (const param of params) {
    const trimmedParam = param.trim();
    if (trimmedParam.length === 0) continue;

    // Look for boundary= prefix
    const eqIndex = trimmedParam.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmedParam.slice(0, eqIndex).trim().toLowerCase();
    if (key !== 'boundary') continue;

    // Extract value after the =
    const value = trimmedParam.slice(eqIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      boundaryValue = value.slice(1, -1);
    } else {
      boundaryValue = value;
    }
    break;
  }

  // Check if boundary was found
  if (boundaryValue === null) {
    throw new SyntaxError('Missing boundary parameter');
  }

  // Validate boundary length (1-70 characters)
  if (boundaryValue.length < 1 || boundaryValue.length > 70) {
    throw new RangeError('Boundary must be 1-70 characters');
  }

  // Validate boundary characters: alphanumeric, space, and '()+−/:=?'
  const validCharPattern = /^[A-Za-z0-9 ()+\-/:=?]*$/;
  if (!validCharPattern.test(boundaryValue)) {
    throw new RangeError('Boundary contains invalid characters');
  }

  return boundaryValue;
}

export { parseMultipartBoundary };