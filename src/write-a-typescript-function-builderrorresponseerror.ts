// bloom-deps:

function buildErrorResponse(
  error: unknown,
  statusCode: unknown
): { status: number; error: string; message: string } {
  // Validate statusCode type
  if (typeof statusCode !== "number") {
    throw new TypeError("statusCode must be of type 'number'");
  }

  // Validate statusCode is finite
  if (!Number.isFinite(statusCode)) {
    throw new TypeError("statusCode must be finite");
  }

  // Validate statusCode is an integer
  if (!Number.isInteger(statusCode)) {
    throw new TypeError("statusCode must be an integer");
  }

  // Validate statusCode is in range 400-599 inclusive
  if (statusCode < 400 || statusCode > 599) {
    throw new RangeError(
      "statusCode must be in the range 400 to 599 inclusive"
    );
  }

  // Derive error and message from error argument
  let errorName: string;
  let errorMessage: string;

  if (error instanceof Error) {
    errorName = error.constructor.name;
    errorMessage = error.message;
  } else if (typeof error === "string" && error.length > 0) {
    errorName = "Error";
    errorMessage = error;
  } else {
    errorName = "Error";
    errorMessage = "An unexpected error occurred";
  }

  return {
    status: statusCode,
    error: errorName,
    message: errorMessage,
  };
}

export { buildErrorResponse };