// bloom-deps:

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
  if (typeof serviceName !== 'string' || serviceName.trim() === '') {
    throw new TypeError('serviceName must be a non-empty string');
  }

  if (typeof version !== 'string' || version.trim() === '') {
    throw new TypeError('version must be a non-empty string');
  }

  if (!Array.isArray(checks) || checks.length === 0) {
    throw new TypeError('checks must be a non-empty array');
  }

  const normalisedChecks: Array<{ name: string; status: 'pass' | 'fail'; message: string | null }> = [];

  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];

    if (
      check === null ||
      typeof check !== 'object' ||
      Array.isArray(check)
    ) {
      throw new TypeError(`check[${i}].name must be a non-empty string`);
    }

    const { name, status, message } = check as Record<string, unknown>;

    if (typeof name !== 'string' || name.trim() === '') {
      throw new TypeError(`check[${i}].name must be a non-empty string`);
    }

    if (status !== 'pass' && status !== 'fail') {
      throw new RangeError(`check[${i}].status must be 'pass' or 'fail'`);
    }

    let normalisedMessage: string | null = null;
    if (message !== undefined) {
      if (typeof message === 'string' || message === null) {
        normalisedMessage = message as string | null;
      } else {
        normalisedMessage = null;
      }
    }

    normalisedChecks.push({
      name: name.trim(),
      status: status as 'pass' | 'fail',
      message: normalisedMessage,
    });
  }

  const failCount = normalisedChecks.filter(c => c.status === 'fail').length;
  const totalCount = normalisedChecks.length;

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';

  if (failCount === 0) {
    overallStatus = 'healthy';
  } else if (failCount > totalCount / 2) {
    overallStatus = 'unhealthy';
  } else {
    overallStatus = 'degraded';
  }

  return {
    service: serviceName.trim(),
    version: version.trim(),
    status: overallStatus,
    checks: normalisedChecks,
    timestamp: new Date().toISOString(),
  };
}