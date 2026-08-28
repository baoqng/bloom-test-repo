// bloom-deps:

export function validatePortNumber(port: unknown): number {
  if (typeof port !== 'number' || Number.isNaN(port)) {
    throw new TypeError('port must be a number');
  }
  if (!Number.isFinite(port) || !Number.isInteger(port)) {
    throw new RangeError('port must be a finite integer');
  }
  if (port < 0 || port > 65535) {
    throw new RangeError('port must be between 0 and 65535');
  }
  return port;
}