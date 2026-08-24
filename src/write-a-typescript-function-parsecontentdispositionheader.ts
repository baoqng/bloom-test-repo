// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public context?: { cause?: Error }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function parseContentDisposition(header: unknown): { type: string; filename?: string } {
  // Input validation guard: check type
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  // Check for empty or whitespace-only string
  const trimmedHeader = header.trim();
  if (trimmedHeader.length === 0) {
    throw new TypeError('header cannot be empty or contain only whitespace');
  }

  // Split by semicolon to get type token and parameters
  const tokens = trimmedHeader.split(';');
  
  // Extract and validate disposition type (first token)
  const typeToken = tokens[0].trim();
  if (typeToken.length === 0) {
    throw new TypeError('disposition type token cannot be empty');
  }

  const dispositionType = typeToken.toLowerCase();
  const result: { type: string; filename?: string } = {
    type: dispositionType
  };

  // Process remaining tokens as parameters (key=value pairs)
  for (let i = 1; i < tokens.length; i++) {
    const param = tokens[i].trim();
    if (param.length === 0) {
      continue;
    }

    const eqIndex = param.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }

    const key = param.substring(0, eqIndex).trim().toLowerCase();
    const value = param.substring(eqIndex + 1).trim();

    // Handle filename parameter
    if (key === 'filename') {
      // Strip surrounding double quotes if present
      let filename = value;
      if (filename.startsWith('"') && filename.endsWith('"') && filename.length >= 2) {
        filename = filename.substring(1, filename.length - 1);
      }

      // Only include filename if non-empty after processing
      if (filename.length > 0) {
        result.filename = filename;
      }
    }
  }

  return result;
}