// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (proto.constructor !== undefined && typeof proto.constructor === 'function' && proto.constructor !== Object) return false;
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function buildMultiStatusBody(results: unknown): { href: string; status: number; message: string }[] {
  if (!Array.isArray(results)) {
    throw new TypeError('results must be an array');
  }

  if (results.length === 0) {
    throw new RangeError('results must not be empty');
  }

  const output: { href: string; status: number; message: string }[] = [];

  for (const element of results) {
    if (element === null || !isPlainObject(element)) {
      throw new TypeError('each result must be an object');
    }

    const record = element as Record<string, unknown>;

    // Validate href
    if (!('href' in record) || typeof record['href'] !== 'string') {
      throw new TypeError('href must be a string');
    }
    const href = record['href'] as string;
    if (href.trim() === '') {
      throw new RangeError('href must not be empty');
    }

    // Validate status
    if (!('status' in record) || typeof record['status'] !== 'number') {
      throw new TypeError('status must be a number');
    }
    const status = record['status'] as number;
    if (!Number.isFinite(status) || !Number.isInteger(status) || status < 100 || status > 599) {
      throw new RangeError('status must be between 100 and 599');
    }

    // Validate message
    let message = '';
    if ('message' in record) {
      if (typeof record['message'] !== 'string') {
        throw new TypeError('message must be a string');
      }
      message = record['message'] as string;
    }

    output.push({
      href: href.trim(),
      status,
      message: (message || '').trim(),
    });
  }

  return output;
}