// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

function normalizeApiError(error: unknown): {
  code: string;
  message: string;
  statusHint: number;
  details: Record<string, unknown>;
} {
  // Determine code
  let code = 'INTERNAL_ERROR';
  if (isPlainObject(error)) {
    const rawCode = error['code'];
    if (typeof rawCode === 'string' && rawCode.length > 0) {
      code = rawCode;
    }
  }

  // Determine message
  let message = 'An unexpected error occurred';
  if (error instanceof Error) {
    message = error.message;
  } else if (isPlainObject(error)) {
    const rawMessage = error['message'];
    if (typeof rawMessage === 'string') {
      message = rawMessage;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  // Determine statusHint
  let statusHint = 500;
  if (
    code.startsWith('VALIDATION_') ||
    code.startsWith('INVALID_')
  ) {
    statusHint = 400;
  } else if (code.startsWith('AUTH_') || code === 'UNAUTHORIZED') {
    statusHint = 401;
  } else if (code.startsWith('FORBIDDEN_') || code === 'FORBIDDEN') {
    statusHint = 403;
  } else if (code.startsWith('NOT_FOUND_') || code === 'NOT_FOUND') {
    statusHint = 404;
  } else if (code.startsWith('CONFLICT_') || code === 'CONFLICT') {
    statusHint = 409;
  } else if (code.startsWith('UNPROCESSABLE_')) {
    statusHint = 422;
  } else if (code.startsWith('RATE_LIMIT_')) {
    statusHint = 429;
  }

  // Determine details
  let details: Record<string, unknown> = {};
  if (isPlainObject(error)) {
    const rawDetails = error['details'];
    if (isPlainObject(rawDetails)) {
      details = rawDetails;
    }
  } else if (error instanceof Error) {
    const cause = error.cause;
    if (isPlainObject(cause)) {
      details = cause;
    }
  }

  return { code, message, statusHint, details };
}

export { normalizeApiError };