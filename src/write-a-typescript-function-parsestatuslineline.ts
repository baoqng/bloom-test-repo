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

export function parseStatusLine(line: unknown): { version: string; code: number; reason: string } {
  // Validate input type
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  // Check if line begins with 'HTTP/'
  if (!line.startsWith('HTTP/')) {
    throw new SyntaxError('line does not begin with "HTTP/"');
  }

  // Split by spaces to get tokens
  const tokens = line.split(' ');

  // Check for at least three space-delimited tokens
  if (tokens.length < 3) {
    throw new SyntaxError('line does not have at least three space-delimited tokens');
  }

  // Extract version portion (text after 'HTTP/' up to the first space)
  const versionToken = tokens[0];
  const version = versionToken.slice(5); // Remove 'HTTP/' prefix

  // Check if version portion is empty
  if (version.length === 0) {
    throw new SyntaxError('version portion is empty');
  }

  // Extract and validate status code
  const codeToken = tokens[1];
  const code = parseInt(codeToken, 10);

  // Check if status code is a valid integer
  if (isNaN(code) || code.toString() !== codeToken) {
    throw new SyntaxError('status code token cannot be parsed as an integer');
  }

  // Check if status code is in range 100 to 599 inclusive
  if (code < 100 || code > 599) {
    throw new RangeError('status code is not in the range 100 to 599 inclusive');
  }

  // Extract reason phrase (everything after status code, trimmed)
  const reason = tokens.slice(2).join(' ').trim();

  // Check if reason phrase is empty
  if (reason.length === 0) {
    throw new SyntaxError('reason phrase is empty');
  }

  return { version, code, reason };
}