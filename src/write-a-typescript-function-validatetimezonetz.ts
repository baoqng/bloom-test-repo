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

export function validateTimeZone(tz: unknown): string {
  // Input validation guard: check type
  if (typeof tz !== 'string') {
    throw new TypeError('Time zone identifier must be a non-empty string');
  }

  // Check for empty string
  if (tz === '') {
    throw new TypeError('Time zone identifier must be a non-empty string');
  }

  // Validate by constructing Intl.DateTimeFormat with the timezone
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
  } catch (error) {
    // Catch RangeError from Intl.DateTimeFormat and throw new Error
    if (error instanceof RangeError) {
      throw new Error(`Invalid IANA time zone: '${tz}'`);
    }
    // If it's a different type of error, rethrow with context
    throw new ServiceError('Time zone validation failed', { cause: error });
  }

  // Return tz unchanged if valid
  return tz;
}