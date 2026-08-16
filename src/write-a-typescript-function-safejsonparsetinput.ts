// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

export function safeJsonParse<T>(input: unknown): T {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new TypeError(
      `Expected a non-empty string, but received: ${input === null ? 'null' : typeof input === 'string' ? 'empty string' : typeof input}`
    );
  }

  try {
    const parsed = JSON.parse(input) as T;
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(
        `Failed to parse JSON: ${error.message}`,
        { cause: error }
      );
    }
    throw new ServiceError('safeJsonParse operation failed', { cause: error });
  }
}