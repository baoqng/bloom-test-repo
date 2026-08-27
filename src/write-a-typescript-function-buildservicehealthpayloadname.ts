// bloom-deps:

export function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      return Object.getPrototypeOf(value) === Object.prototype;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === null;
}

export function buildServiceHealthPayload(
  name: unknown,
  version: unknown,
  checks: unknown
): {
  name: string;
  version: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: { name: string; status: string; message?: string }[];
} {
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string');
  }
  if (typeof version !== 'string') {
    throw new TypeError('version must be a string');
  }
  if (!Array.isArray(checks)) {
    throw new TypeError('checks must be an array');
  }

  if (name.trim().length === 0) {
    throw new RangeError('name must not be empty');
  }
  if (version.trim().length === 0) {
    throw new RangeError('version must not be empty');
  }

  const normalizedChecks: { name: string; status: string; message?: string }[] = [];

  for (const check of checks) {
    if (check === null || !isPlainObject(check)) {
      throw new TypeError('each check must be an object');
    }

    const checkObj = check as Record<string, unknown>;

    if (typeof checkObj['name'] !== 'string') {
      throw new TypeError('check name must be a string');
    }
    if ((checkObj['name'] as string).trim().length === 0) {
      throw new RangeError('check name must not be empty');
    }

    if (typeof checkObj['status'] !== 'string') {
      throw new TypeError('check status must be a string');
    }
    if ((checkObj['status'] as string).trim().length === 0) {
      throw new RangeError('check status must not be empty');
    }

    if (checkObj['message'] !== undefined) {
      if (typeof checkObj['message'] !== 'string') {
        throw new TypeError('check message must be a string');
      }
    }

    const normalizedCheck: { name: string; status: string; message?: string } = {
      name: checkObj['name'] as string,
      status: checkObj['status'] as string,
    };

    if (checkObj['message'] !== undefined) {
      normalizedCheck.message = checkObj['message'] as string;
    }

    normalizedChecks.push(normalizedCheck);
  }

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (normalizedChecks.some(c => c.status === 'unhealthy')) {
    overallStatus = 'unhealthy';
  } else if (normalizedChecks.some(c => c.status === 'degraded')) {
    overallStatus = 'degraded';
  }

  return {
    name: name.trim(),
    version: version.trim(),
    status: overallStatus,
    checks: normalizedChecks,
  };
}