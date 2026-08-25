// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseDottedPath(path: unknown): string[] {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs.
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string');
  }

  // [STATED] path is empty string '' [empty_string] -> "throw_syntax_error"
  if (path.length === 0) {
    throw new SyntaxError('Path must be a non-empty string');
  }

  // Split on '.' characters
  const segments = path.split('.');

  // [STATED] any segment resulting from split is empty (leading dot, trailing dot, or consecutive dots) [empty_segment] -> "throw_syntax_error"
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === '') {
      throw new SyntaxError(`Invalid path: empty segment at position ${i}`);
    }
  }

  // [STATED] well-formed dot-separated path string with no empty segments [valid_dotted_path] -> "array of non-empty segment strings"
  return segments;
}