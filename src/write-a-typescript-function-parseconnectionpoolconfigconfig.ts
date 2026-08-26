// bloom-deps:

export function parseConnectionPoolConfig(config: unknown): {
  minConnections: number;
  maxConnections: number;
  idleTimeoutMs: number;
  acquireTimeoutMs: number;
} {
  // Validate config is a plain object
  if (
    config === null ||
    typeof config !== "object" ||
    Array.isArray(config) ||
    (Object.getPrototypeOf(config) !== Object.prototype &&
      Object.getPrototypeOf(config) !== null)
  ) {
    throw new TypeError("config must be a plain object");
  }

  const obj = config as Record<string, unknown>;

  // Validate minConnections
  const minConnections = obj["minConnections"];
  if (
    minConnections === undefined ||
    minConnections === null ||
    typeof minConnections !== "number" ||
    !isFinite(minConnections) ||
    !Number.isInteger(minConnections) ||
    minConnections < 0
  ) {
    throw new TypeError("minConnections must be a non-negative integer");
  }

  // Validate maxConnections
  const maxConnections = obj["maxConnections"];
  if (
    maxConnections === undefined ||
    maxConnections === null ||
    typeof maxConnections !== "number" ||
    !isFinite(maxConnections) ||
    !Number.isInteger(maxConnections) ||
    maxConnections <= 0
  ) {
    throw new TypeError("maxConnections must be a positive integer");
  }

  // Validate maxConnections > minConnections
  if (maxConnections <= minConnections) {
    throw new RangeError("maxConnections must be greater than minConnections");
  }

  // Validate idleTimeoutMs
  const idleTimeoutMs = obj["idleTimeoutMs"];
  if (
    idleTimeoutMs === undefined ||
    idleTimeoutMs === null ||
    typeof idleTimeoutMs !== "number" ||
    !isFinite(idleTimeoutMs) ||
    !Number.isInteger(idleTimeoutMs) ||
    idleTimeoutMs <= 0
  ) {
    throw new TypeError("idleTimeoutMs must be a positive integer");
  }

  // Validate acquireTimeoutMs
  const acquireTimeoutMs = obj["acquireTimeoutMs"];
  if (
    acquireTimeoutMs === undefined ||
    acquireTimeoutMs === null ||
    typeof acquireTimeoutMs !== "number" ||
    !isFinite(acquireTimeoutMs) ||
    !Number.isInteger(acquireTimeoutMs) ||
    acquireTimeoutMs <= 0
  ) {
    throw new TypeError("acquireTimeoutMs must be a positive integer");
  }

  return {
    minConnections: minConnections as number,
    maxConnections: maxConnections as number,
    idleTimeoutMs: idleTimeoutMs as number,
    acquireTimeoutMs: acquireTimeoutMs as number,
  };
}