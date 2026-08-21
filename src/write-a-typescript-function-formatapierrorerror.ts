// bloom-deps:

function formatApiError(
  error: unknown,
  statusCode: number
): { statusCode: number; error: string; message: string; timestamp: string } {
  if (!Number.isInteger(statusCode) || !isFinite(statusCode) || statusCode < 400 || statusCode > 599) {
    throw new RangeError('statusCode must be an integer between 400 and 599');
  }

  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'An unexpected error occurred';
  }

  const statusTextMap: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
  };

  const errorText = statusTextMap[statusCode] ?? 'Error';

  return {
    statusCode,
    error: errorText,
    message,
    timestamp: new Date().toISOString(),
  };
}

export { formatApiError };