// bloom-deps:

export function validateNetworkPort(port: unknown): { value: number; category: 'well-known' | 'registered' | 'dynamic' } {
  if (typeof port !== 'number' || Number.isNaN(port)) {
    throw new TypeError('port must be a number');
  }

  if (!Number.isFinite(port) || !Number.isInteger(port)) {
    throw new RangeError('port must be a finite integer');
  }

  if (port < 0 || port > 65535) {
    throw new RangeError('port must be between 0 and 65535');
  }

  let category: 'well-known' | 'registered' | 'dynamic';
  if (port <= 1023) {
    category = 'well-known';
  } else if (port <= 49151) {
    category = 'registered';
  } else {
    category = 'dynamic';
  }

  return { value: port, category };
}