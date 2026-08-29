// bloom-deps:

export function buildErrorResponse(
  error: unknown,
  requestId: unknown
): { statusCode: number; body: string } {
  // Validate error is an Error instance
  if (!(error instanceof Error)) {
    throw new TypeError("error must be an Error instance");
  }

  // Validate requestId is a non-empty string
  if (typeof requestId !== "string" || requestId.length === 0) {
    throw new TypeError("requestId must be a non-empty string");
  }

  // Derive statusCode from error.name
  let statusCode: number;
  switch (error.name) {
    case "ValidationError":
      statusCode = 400;
      break;
    case "UnauthorizedError":
      statusCode = 401;
      break;
    case "ForbiddenError":
      statusCode = 403;
      break;
    case "NotFoundError":
      statusCode = 404;
      break;
    case "ConflictError":
      statusCode = 409;
      break;
    case "RateLimitError":
      statusCode = 429;
      break;
    default:
      statusCode = 500;
  }

  // Build body with no extra whitespace
  const body = JSON.stringify({
    error: error.name,
    message: error.message,
    requestId,
  });

  return { statusCode, body };
}