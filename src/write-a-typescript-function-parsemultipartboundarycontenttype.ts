// bloom-deps:

function parseMultipartBoundary(contentType: string): string {
  if (typeof contentType !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const trimmed = contentType.trim();

  if (!trimmed.toLowerCase().startsWith('multipart/')) {
    throw new SyntaxError('Content-Type is not a multipart type');
  }

  const parts = trimmed.split(';');

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim();
    const eqIndex = part.indexOf('=');
    if (eqIndex === -1) continue;

    const paramName = part.slice(0, eqIndex).trim().toLowerCase();
    if (paramName === 'boundary') {
      let paramValue = part.slice(eqIndex + 1).trim();
      if (paramValue.startsWith('"') && paramValue.endsWith('"') && paramValue.length >= 2) {
        paramValue = paramValue.slice(1, -1);
      }
      return paramValue;
    }
  }

  throw new SyntaxError('No boundary parameter found in Content-Type header');
}

export { parseMultipartBoundary };