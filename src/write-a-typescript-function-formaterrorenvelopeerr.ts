// bloom-deps:

function deriveCode(message: string): string {
  return message
    .toUpperCase()
    .replace(/ /g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .slice(0, 64);
}

export function formatErrorEnvelope(
  err: unknown,
  statusCode: unknown
): { error: { code: string; message: string; status: number } } {
  if (typeof statusCode !== 'number') {
    throw new TypeError('statusCode must be a number');
  }

  if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
    throw new RangeError('statusCode must be between 400 and 599');
  }

  let message: string;

  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  } else {
    message = 'An unexpected error occurred';
  }

  const code = deriveCode(message);

  return {
    error: {
      code,
      message,
      status: statusCode,
    },
  };
}