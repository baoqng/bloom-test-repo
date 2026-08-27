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

export function parseRetryPolicy(config: unknown): {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
} {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config must be an object');
  }

  const cfg = config as Record<string, unknown>;

  if (typeof cfg['maxAttempts'] !== 'number') {
    throw new TypeError('maxAttempts must be a number');
  }
  if (typeof cfg['baseDelayMs'] !== 'number') {
    throw new TypeError('baseDelayMs must be a number');
  }
  if (typeof cfg['maxDelayMs'] !== 'number') {
    throw new TypeError('maxDelayMs must be a number');
  }
  if (typeof cfg['backoffFactor'] !== 'number') {
    throw new TypeError('backoffFactor must be a number');
  }

  const maxAttempts = cfg['maxAttempts'] as number;
  const baseDelayMs = cfg['baseDelayMs'] as number;
  const maxDelayMs = cfg['maxDelayMs'] as number;
  const backoffFactor = cfg['backoffFactor'] as number;

  if (!Number.isFinite(maxAttempts) || !Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new RangeError('maxAttempts must be an integer between 1 and 10');
  }

  if (!Number.isFinite(baseDelayMs) || !Number.isInteger(baseDelayMs) || baseDelayMs < 1 || baseDelayMs > 60000) {
    throw new RangeError('baseDelayMs must be a positive integer not exceeding 60000');
  }

  if (!Number.isFinite(maxDelayMs) || !Number.isInteger(maxDelayMs) || maxDelayMs < 1 || maxDelayMs > 300000) {
    throw new RangeError('maxDelayMs must be a positive integer not exceeding 300000');
  }

  if (maxDelayMs < baseDelayMs) {
    throw new RangeError('maxDelayMs must be greater than or equal to baseDelayMs');
  }

  if (!Number.isFinite(backoffFactor) || backoffFactor < 1.0 || backoffFactor > 10.0) {
    throw new RangeError('backoffFactor must be a number between 1.0 and 10.0 inclusive');
  }

  return { maxAttempts, baseDelayMs, maxDelayMs, backoffFactor };
}