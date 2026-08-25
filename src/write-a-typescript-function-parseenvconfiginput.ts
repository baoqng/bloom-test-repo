// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseEnvConfig(input: unknown): Record<string, string> {
  // [REQUIRED] Validate input type
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const result: Record<string, string> = {};
  const lines = input.split('\n');
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineNumber = lineIndex + 1; // 1-based line number for error messages
    
    // [STATED] Skip blank lines (empty or whitespace-only)
    if (line.trim() === '') {
      continue;
    }
    
    // [STATED] Skip comment lines (first non-whitespace character is '#')
    if (line.trim().startsWith('#')) {
      continue;
    }
    
    // [STATED] Check for missing '=' separator
    if (!line.includes('=')) {
      throw new SyntaxError(`Line ${lineNumber}: missing '=' separator`);
    }
    
    // Split on first '=' and trim both parts
    const equalsIndex = line.indexOf('=');
    const keyRaw = line.substring(0, equalsIndex).trim();
    const valueRaw = line.substring(equalsIndex + 1).trim();
    
    // [STATED] Check for empty key
    if (keyRaw === '') {
      throw new SyntaxError(`Line ${lineNumber}: key must be non-empty`);
    }
    
    // [STATED] Validate key format: ^[A-Z][A-Z0-9_]*$
    const keyPattern = /^[A-Z][A-Z0-9_]*$/;
    if (!keyPattern.test(keyRaw)) {
      throw new SyntaxError(`Line ${lineNumber}: key must match [A-Z][A-Z0-9_]*`);
    }
    
    // [STATED] Store the trimmed key and value
    result[keyRaw] = valueRaw;
  }
  
  return result;
}