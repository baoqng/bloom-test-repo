// bloom-deps:

export interface HealthPayload {
  status: 'ok' | 'degraded' | 'down';
  uptimeMs: number;
  checks: Record<string, 'ok' | 'degraded' | 'down'>;
}

const VALID_CHECK_VALUES = new Set(['ok', 'degraded', 'down']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildHealthPayload(checks: unknown, uptimeMs: unknown): HealthPayload {
  if (!isPlainObject(checks)) {
    throw new TypeError('checks must be a plain object');
  }

  if (typeof uptimeMs !== 'number') {
    throw new TypeError('uptimeMs must be a number');
  }

  if (!Number.isFinite(uptimeMs)) {
    throw new RangeError('uptimeMs must be a finite number');
  }

  if (uptimeMs < 0) {
    throw new RangeError('uptimeMs must not be negative');
  }

  const validatedChecks: Record<string, 'ok' | 'degraded' | 'down'> = {};

  for (const [key, value] of Object.entries(checks)) {
    if (!VALID_CHECK_VALUES.has(value as string)) {
      throw new TypeError(
        `Invalid check value for key "${key}": must be 'ok', 'degraded', or 'down'`
      );
    }
    validatedChecks[key] = value as 'ok' | 'degraded' | 'down';
  }

  let status: 'ok' | 'degraded' | 'down' = 'ok';

  for (const value of Object.values(validatedChecks)) {
    if (value === 'down') {
      status = 'down';
      break;
    }
    if (value === 'degraded') {
      status = 'degraded';
    }
  }

  return {
    status,
    uptimeMs,
    checks: validatedChecks,
  };
}