// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;

  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Keep walking — if we reach Object.prototype, check if it's the direct proto
      break;
    }
    proto = Object.getPrototypeOf(proto);
  }

  // Walk the full prototype chain: plain objects have Object.prototype as their
  // direct prototype, or null (Object.create(null))
  const directProto = Object.getPrototypeOf(value);
  if (directProto === null) return true;
  if (directProto === Object.prototype) return true;
  return false;
}

export function buildBaggageHeader(entries: Record<string, string>): string {
  if (!isPlainObject(entries)) {
    throw new TypeError('entries must be a plain object');
  }

  const pairs = Object.entries(entries);

  if (pairs.length === 0) {
    throw new RangeError('Baggage must contain at least one entry');
  }

  const parts: string[] = [];

  for (const [key, value] of pairs) {
    // Validate key
    if (key.length === 0) {
      throw new TypeError('Invalid baggage key: ' + key);
    }
    if (/[=,;\\"'\s]/.test(key) || /[=,;\\"\s]/.test(key)) {
      throw new TypeError('Invalid baggage key: ' + key);
    }
    // Check forbidden chars in key: =, comma, ;, \, ", whitespace
    if (/[=,;\\"\\s]/.test(key)) {
      throw new TypeError('Invalid baggage key: ' + key);
    }

    // Validate value — comma, ;, or \
    if (/[,;\\]/.test(value)) {
      throw new TypeError('Invalid baggage value for key ' + key + ': ' + value);
    }

    parts.push(key + '=' + value);
  }

  return parts.join(', ');
}

// Clean up: rewrite with correct key validation regex

export function buildBaggageHeader2(entries: Record<string, string>): string {
  if (!isPlainObject(entries)) {
    throw new TypeError('entries must be a plain object');
  }

  const pairs = Object.entries(entries);

  if (pairs.length === 0) {
    throw new RangeError('Baggage must contain at least one entry');
  }

  const parts: string[] = [];

  for (const [key, value] of pairs) {
    if (key.length === 0) {
      throw new TypeError('Invalid baggage key: ' + key);
    }

    // Forbidden key chars: =, comma, ;, \, ", any whitespace
    if (/[=,;\\"  \t\r\n\f\v]/.test(key) || /\s/.test(key)) {
      throw new TypeError('Invalid baggage key: ' + key);
    }

    // Forbidden value chars: comma, ;, \
    if (/[,;\\]/.test(value)) {
      throw new TypeError('Invalid baggage value for key ' + key + ': ' + value);
    }

    parts.push(key + '=' + value);
  }

  return parts.join(', ');
}

// Override the export with the correct implementation
Object.defineProperty(exports, 'buildBaggageHeader', {
  value: function(entries: Record<string, string>): string {
    if (!isPlainObject(entries)) {
      throw new TypeError('entries must be a plain object');
    }

    const pairs = Object.entries(entries);

    if (pairs.length === 0) {
      throw new RangeError('Baggage must contain at least one entry');
    }

    const parts: string[] = [];

    for (const [key, value] of pairs) {
      if (key.length === 0) {
        throw new TypeError('Invalid baggage key: ' + key);
      }

      // Forbidden key chars: =, comma, ;, \, ", any whitespace
      if (/[=,;\\"]/u.test(key) || /\s/.test(key)) {
        throw new TypeError('Invalid baggage key: ' + key);
      }

      // Forbidden value chars: comma, ;, \
      if (/[,;\\]/.test(value)) {
        throw new TypeError('Invalid baggage value for key ' + key + ': ' + value);
      }

      parts.push(key + '=' + value);
    }

    return parts.join(', ');
  },
  writable: true,
  configurable: true,
});