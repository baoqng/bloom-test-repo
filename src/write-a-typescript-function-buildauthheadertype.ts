// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === null;
}

export function buildAuthHeader(type: unknown, credentials: unknown): string {
  if (type !== 'Basic' && type !== 'Bearer') {
    throw new TypeError(`Invalid authorization type: ${String(type)}`);
  }

  if (type === 'Basic') {
    if (!isPlainObject(credentials)) {
      throw new TypeError('credentials must be a plain object with username and password for Basic auth');
    }

    const { username, password } = credentials as Record<string, unknown>;

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new TypeError('credentials.username and credentials.password must be strings for Basic auth');
    }

    if (username.length === 0) {
      throw new RangeError('credentials.username must not be empty');
    }

    if (password.length === 0) {
      throw new RangeError('credentials.password must not be empty');
    }

    return 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  }

  // type === 'Bearer'
  if (typeof credentials !== 'string') {
    throw new TypeError('credentials must be a non-empty string token for Bearer auth');
  }

  if (credentials.length === 0) {
    throw new RangeError('credentials (token) must not be empty for Bearer auth');
  }

  return 'Bearer ' + credentials;
}