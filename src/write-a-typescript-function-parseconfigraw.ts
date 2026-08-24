// bloom-deps:

interface Config {
  host: string;
  port: number;
  timeout: number;
}

export function parseConfig(raw: unknown): Config {
  if (raw === null || raw === undefined || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('Invalid config');
  }

  const obj = raw as Record<string, unknown>;

  // Validate host
  const host = obj['host'];
  if (typeof host !== 'string') {
    throw new TypeError('Invalid config');
  }
  if (host.length === 0) {
    throw new TypeError('Invalid config');
  }

  // Validate port
  const port = obj['port'];
  if (typeof port !== 'number') {
    throw new TypeError('Invalid config');
  }
  if (!Number.isInteger(port)) {
    throw new TypeError('Invalid config');
  }
  if (port < 1 || port > 65535) {
    throw new TypeError('Invalid config');
  }

  // Validate timeout
  const timeout = obj['timeout'];
  if (typeof timeout !== 'number') {
    throw new TypeError('Invalid config');
  }
  if (!Number.isInteger(timeout)) {
    throw new TypeError('Invalid config');
  }
  if (timeout <= 0) {
    throw new TypeError('Invalid config');
  }

  return {
    host,
    port,
    timeout,
  };
}