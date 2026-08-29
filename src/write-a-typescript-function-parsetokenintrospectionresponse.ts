// bloom-deps:

function isPlainObject(x: unknown): x is Record<string, unknown> {
  if (x === null) return false;
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

export function parseTokenIntrospection(response: unknown): {
  active: boolean;
  subject?: string;
  scope?: string;
  expiresAt?: number;
  clientId?: string;
} {
  if (!isPlainObject(response)) {
    throw new TypeError('Expected a plain object');
  }

  if (!('active' in response) || typeof response['active'] !== 'boolean') {
    throw new TypeError('active must be a boolean');
  }

  const active = response['active'] as boolean;

  if (!active) {
    return { active: false };
  }

  const result: {
    active: boolean;
    subject?: string;
    scope?: string;
    expiresAt?: number;
    clientId?: string;
  } = { active: true };

  if ('sub' in response) {
    if (typeof response['sub'] !== 'string') {
      throw new TypeError('sub must be a string');
    }
    result.subject = response['sub'] as string;
  }

  if ('scope' in response) {
    if (typeof response['scope'] !== 'string') {
      throw new TypeError('scope must be a string');
    }
    result.scope = response['scope'] as string;
  }

  if ('exp' in response) {
    if (typeof response['exp'] !== 'number') {
      throw new TypeError('exp must be a number');
    }
    const exp = response['exp'] as number;
    if (exp <= 0) {
      throw new RangeError('exp must be a positive number');
    }
    result.expiresAt = exp;
  }

  if ('client_id' in response) {
    if (typeof response['client_id'] !== 'string') {
      throw new TypeError('client_id must be a string');
    }
    result.clientId = response['client_id'] as string;
  }

  return result;
}