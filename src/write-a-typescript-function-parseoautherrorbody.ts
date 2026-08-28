// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // Object.create(null) has no prototype chain leading to Object.prototype
  // but is still a plain object
  if (Object.getPrototypeOf(value) === null) return true;
  return false;
}

export function parseOAuthError(body: unknown): {
  error: string;
  errorDescription: string | null;
  errorUri: string | null;
} {
  // Validate plain object
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new TypeError('body must be a plain object');
  }

  // Walk full prototype chain to check for plain object
  let proto = Object.getPrototypeOf(body);
  let isPlain = false;
  if (proto === null) {
    isPlain = true;
  } else {
    while (proto !== null) {
      if (proto === Object.prototype) {
        isPlain = true;
        break;
      }
      proto = Object.getPrototypeOf(proto);
    }
    // If we reached Object.prototype, that's fine.
    // But if the direct prototype IS Object.prototype, it's plain.
    // If there are extra levels (class instance), it won't be caught above correctly.
    // Let me re-check: for a class instance `class Foo {}; new Foo()`,
    // prototype chain is: instance -> Foo.prototype -> Object.prototype
    // So the loop WOULD find Object.prototype and set isPlain = true — that's wrong.
    // We need to check that the DIRECT prototype is Object.prototype or null.
  }

  // Correct check: direct prototype must be Object.prototype or null
  const directProto = Object.getPrototypeOf(body);
  if (directProto !== null && directProto !== Object.prototype) {
    throw new TypeError('body must be a plain object');
  }

  const bodyObj = body as Record<string, unknown>;

  // Validate error field
  if (typeof bodyObj['error'] !== 'string') {
    throw new TypeError('error must be a non-empty string');
  }

  const trimmedError = (bodyObj['error'] as string).trim();
  if (trimmedError.length === 0) {
    throw new TypeError('error must be a non-empty string');
  }

  if (/[^a-zA-Z0-9_]/.test(trimmedError)) {
    throw new RangeError('error must contain only letters, digits, and underscores');
  }

  // Validate error_description
  let errorDescription: string | null = null;
  if ('error_description' in bodyObj && bodyObj['error_description'] !== null) {
    if (typeof bodyObj['error_description'] !== 'string') {
      throw new TypeError('error_description must be a string');
    }
    errorDescription = (bodyObj['error_description'] as string).trim();
  }

  // Validate error_uri
  let errorUri: string | null = null;
  if ('error_uri' in bodyObj && bodyObj['error_uri'] !== null) {
    if (typeof bodyObj['error_uri'] !== 'string') {
      throw new TypeError('error_uri must be a string');
    }
    const trimmedUri = (bodyObj['error_uri'] as string).trim();
    try {
      new URL(trimmedUri);
    } catch {
      throw new RangeError('error_uri is not a valid URL');
    }
    errorUri = trimmedUri;
  }

  return {
    error: trimmedError,
    errorDescription,
    errorUri,
  };
}