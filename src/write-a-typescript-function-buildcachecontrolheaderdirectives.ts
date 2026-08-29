// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildCacheControlHeader(directives: unknown): string {
  if (!isPlainObject(directives)) {
    throw new TypeError('directives must be a plain object');
  }

  const obj = directives as Record<string, unknown>;

  // Validate types
  const integerKeys = ['maxAge', 'sMaxAge', 'staleWhileRevalidate'] as const;
  const booleanKeys = ['noCache', 'noStore', 'mustRevalidate', 'public', 'private', 'immutable'] as const;

  for (const key of integerKeys) {
    if (key in obj) {
      const val = obj[key];
      if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
        throw new TypeError(`Invalid directive value for ${key}`);
      }
    }
  }

  for (const key of booleanKeys) {
    if (key in obj) {
      const val = obj[key];
      if (typeof val !== 'boolean') {
        throw new TypeError(`Invalid directive value for ${key}`);
      }
    }
  }

  // Check conflicting directives
  if (obj['public'] === true && obj['private'] === true) {
    throw new RangeError('Conflicting directives: public and private');
  }

  const parts: string[] = [];

  // Order: maxAge, sMaxAge, noCache, noStore, mustRevalidate, public, private, immutable, staleWhileRevalidate
  if ('maxAge' in obj) {
    parts.push(`max-age=${obj['maxAge']}`);
  }
  if ('sMaxAge' in obj) {
    parts.push(`s-maxage=${obj['sMaxAge']}`);
  }
  if ('noCache' in obj && obj['noCache'] === true) {
    parts.push('no-cache');
  }
  if ('noStore' in obj && obj['noStore'] === true) {
    parts.push('no-store');
  }
  if ('mustRevalidate' in obj && obj['mustRevalidate'] === true) {
    parts.push('must-revalidate');
  }
  if ('public' in obj && obj['public'] === true) {
    parts.push('public');
  }
  if ('private' in obj && obj['private'] === true) {
    parts.push('private');
  }
  if ('immutable' in obj && obj['immutable'] === true) {
    parts.push('immutable');
  }
  if ('staleWhileRevalidate' in obj) {
    parts.push(`stale-while-revalidate=${obj['staleWhileRevalidate']}`);
  }

  return parts.join(', ');
}