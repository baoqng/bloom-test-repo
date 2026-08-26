// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseOAuthError(body: unknown): {
  error: string;
  errorDescription: string | null;
  errorUri: string | null;
} {
  if (!isPlainObject(body)) {
    throw new TypeError("body must be a plain object");
  }

  const rawError = (body as Record<string, unknown>).error;
  if (typeof rawError !== "string") {
    throw new TypeError("error must be a non-empty string");
  }
  const trimmedError = rawError.trim();
  if (trimmedError.length === 0) {
    throw new TypeError("error must be a non-empty string");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedError)) {
    throw new RangeError("error must contain only letters, digits, and underscores");
  }

  let errorDescription: string | null = null;
  const rawDescription = (body as Record<string, unknown>).error_description;
  if (rawDescription !== undefined && rawDescription !== null) {
    if (typeof rawDescription !== "string") {
      throw new TypeError("error_description must be a string");
    }
    errorDescription = rawDescription.trim();
  }

  let errorUri: string | null = null;
  const rawUri = (body as Record<string, unknown>).error_uri;
  if (rawUri !== undefined && rawUri !== null) {
    if (typeof rawUri !== "string") {
      throw new TypeError("error_uri must be a string");
    }
    const trimmedUri = rawUri.trim();
    try {
      new URL(trimmedUri);
    } catch {
      throw new RangeError("error_uri is not a valid URL");
    }
    errorUri = trimmedUri;
  }

  return {
    error: trimmedError,
    errorDescription,
    errorUri,
  };
}