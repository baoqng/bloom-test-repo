// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function buildJsonPatchOp(
  op: unknown,
  path: unknown,
  value?: unknown
): { op: string; path: string; value?: unknown } {
  // Validate op is a string
  if (typeof op !== 'string') {
    throw new TypeError('op must be a string');
  }

  // Validate path is a string
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  // Validate op is one of the allowed operations
  const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];
  if (!validOps.includes(op)) {
    throw new RangeError(
      `op must be one of: ${validOps.join(', ')}`
    );
  }

  // Validate path starts with '/'
  if (!path.startsWith('/')) {
    throw new RangeError('path must start with "/"');
  }

  // Validate value constraints based on op type
  if (op === 'remove') {
    if (value !== undefined) {
      throw new RangeError('remove operation must not have a value');
    }
  } else if (['add', 'replace', 'test'].includes(op)) {
    if (value === undefined) {
      throw new RangeError(`${op} operation requires a value`);
    }
  }

  // Build the operation object
  const result: { op: string; path: string; value?: unknown } = {
    op,
    path,
  };

  // Include value only if it's not undefined
  if (value !== undefined) {
    result.value = value;
  }

  return result;
}

export { buildJsonPatchOp, ServiceError };