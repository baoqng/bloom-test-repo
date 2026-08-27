// bloom-deps:

function computeThrottleKey(userId: unknown, endpoint: unknown, method: unknown): string {
  if (typeof userId !== 'string') {
    throw new TypeError('userId must be a string');
  }
  if (typeof endpoint !== 'string') {
    throw new TypeError('endpoint must be a string');
  }
  if (typeof method !== 'string') {
    throw new TypeError('method must be a string');
  }

  if (!userId.trim()) {
    throw new RangeError('userId must not be empty');
  }
  if (!endpoint.trim()) {
    throw new RangeError('endpoint must not be empty');
  }
  if (!method.trim()) {
    throw new RangeError('method must not be empty');
  }

  const normalisedMethod = method.trim().toUpperCase();
  const supportedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  if (!supportedMethods.includes(normalisedMethod)) {
    throw new RangeError('unsupported HTTP method');
  }

  let normalisedEndpoint = endpoint.trim().toLowerCase();
  if (normalisedEndpoint !== '/' && normalisedEndpoint.endsWith('/')) {
    normalisedEndpoint = normalisedEndpoint.slice(0, -1);
  }

  return 'throttle:' + userId.trim() + ':' + normalisedMethod + ':' + normalisedEndpoint;
}

export { computeThrottleKey };