// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function parseConnectionPoolConfig(config: unknown): {
  minConnections: number;
  maxConnections: number;
  idleTimeoutMs: number;
  acquireTimeoutMs: number;
} {
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  const configObj = config as Record<string, unknown>;

  const minConnections = configObj.minConnections;
  if (
    minConnections === undefined ||
    typeof minConnections !== 'number' ||
    !Number.isFinite(minConnections) ||
    !Number.isInteger(minConnections) ||
    minConnections < 0
  ) {
    throw new TypeError('minConnections must be a non-negative integer');
  }

  const maxConnections = configObj.maxConnections;
  if (
    maxConnections === undefined ||
    typeof maxConnections !== 'number' ||
    !Number.isFinite(maxConnections) ||
    !Number.isInteger(maxConnections) ||
    maxConnections <= 0
  ) {
    throw new TypeError('maxConnections must be a positive integer');
  }

  if (maxConnections <= minConnections) {
    throw new RangeError('maxConnections must be greater than minConnections');
  }

  const idleTimeoutMs = configObj.idleTimeoutMs;
  if (
    idleTimeoutMs === undefined ||
    typeof idleTimeoutMs !== 'number' ||
    !Number.isFinite(idleTimeoutMs) ||
    !Number.isInteger(idleTimeoutMs) ||
    idleTimeoutMs <= 0
  ) {
    throw new TypeError('idleTimeoutMs must be a positive integer');
  }

  const acquireTimeoutMs = configObj.acquireTimeoutMs;
  if (
    acquireTimeoutMs === undefined ||
    typeof acquireTimeoutMs !== 'number' ||
    !Number.isFinite(acquireTimeoutMs) ||
    !Number.isInteger(acquireTimeoutMs) ||
    acquireTimeoutMs <= 0
  ) {
    throw new TypeError('acquireTimeoutMs must be a positive integer');
  }

  return {
    minConnections,
    maxConnections,
    idleTimeoutMs,
    acquireTimeoutMs,
  };
}

export { parseConnectionPoolConfig };