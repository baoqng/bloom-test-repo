// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseHealthCheckResponse(body: unknown): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: string; message: string | null }>;
  version: string | null;
} {
  if (!isPlainObject(body)) {
    throw new TypeError('body must be a plain object');
  }

  const rawStatus = body['status'];
  if (
    rawStatus !== 'healthy' &&
    rawStatus !== 'degraded' &&
    rawStatus !== 'unhealthy'
  ) {
    throw new RangeError('status must be healthy, degraded, or unhealthy');
  }
  const status: 'healthy' | 'degraded' | 'unhealthy' = rawStatus;

  let checks: Record<string, { status: string; message: string | null }> = {};

  if ('checks' in body && body['checks'] !== undefined) {
    const rawChecks = body['checks'];
    if (!isPlainObject(rawChecks)) {
      throw new TypeError('checks must be a plain object');
    }
    for (const key of Object.keys(rawChecks)) {
      const entry = rawChecks[key];
      if (!isPlainObject(entry)) {
        continue;
      }
      const checkStatus = entry['status'];
      if (typeof checkStatus !== 'string' || checkStatus.length === 0) {
        continue;
      }
      const rawMessage = entry['message'];
      const message: string | null =
        typeof rawMessage === 'string' && rawMessage.length > 0
          ? rawMessage
          : rawMessage === null || rawMessage === undefined
          ? null
          : typeof rawMessage === 'string'
          ? null
          : null;
      checks[key] = { status: checkStatus, message };
    }
  }

  const rawVersion = body['version'];
  const version: string | null =
    typeof rawVersion === 'string' && rawVersion.length > 0
      ? rawVersion
      : null;

  return { status, checks, version };
}