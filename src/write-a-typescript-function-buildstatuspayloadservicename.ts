// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export function buildStatusPayload(
  serviceName: unknown,
  version: unknown,
  checks: unknown
): {
  service: string;
  version: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Array<{ name: string; status: 'pass' | 'fail'; message: string | null }>;
  timestamp: string;
} {
  if (typeof serviceName !== 'string' || serviceName.trim().length === 0) {
    throw new TypeError('serviceName must be a non-empty string');
  }
  if (typeof version !== 'string' || version.trim().length === 0) {
    throw new TypeError('version must be a non-empty string');
  }
  if (!Array.isArray(checks) || checks.length === 0) {
    throw new TypeError('checks must be a non-empty array');
  }

  const normalizedChecks: Array<{ name: string; status: 'pass' | 'fail'; message: string | null }> = [];

  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    if (!isPlainObject(check)) {
      throw new TypeError(`check[${i}].name must be a non-empty string`);
    }
    const c = check as Record<string, unknown>;

    if (typeof c['name'] !== 'string' || (c['name'] as string).trim().length === 0) {
      throw new TypeError(`check[${i}].name must be a non-empty string`);
    }
    if (c['status'] !== 'pass' && c['status'] !== 'fail') {
      throw new RangeError(`check[${i}].status must be 'pass' or 'fail'`);
    }

    let message: string | null = null;
    if ('message' in c) {
      if (c['message'] !== null && typeof c['message'] !== 'string') {
        message = null;
      } else {
        message = c['message'] as string | null;
      }
    }

    normalizedChecks.push({
      name: (c['name'] as string).trim(),
      status: c['status'] as 'pass' | 'fail',
      message,
    });
  }

  const totalChecks = normalizedChecks.length;
  const failCount = normalizedChecks.filter(c => c.status === 'fail').length;

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  if (failCount === 0) {
    overallStatus = 'healthy';
  } else if (failCount > totalChecks / 2) {
    overallStatus = 'unhealthy';
  } else {
    overallStatus = 'degraded';
  }

  return {
    service: serviceName.trim(),
    version: version.trim(),
    status: overallStatus,
    checks: normalizedChecks,
    timestamp: new Date().toISOString(),
  };
}