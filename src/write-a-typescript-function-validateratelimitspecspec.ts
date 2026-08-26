// bloom-deps:

export function validateRateLimitSpec(spec: unknown): { requests: number; windowMs: number; burst: number } {
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
    throw new TypeError('spec must be a plain object');
  }

  const record = spec as Record<string, unknown>;

  if (typeof record['requests'] !== 'number') {
    throw new TypeError('requests must be a number');
  }
  const requests = record['requests'] as number;
  if (!Number.isFinite(requests) || !Number.isInteger(requests) || requests <= 0) {
    throw new RangeError('requests must be a positive integer');
  }

  if (typeof record['windowMs'] !== 'number') {
    throw new TypeError('windowMs must be a number');
  }
  const windowMs = record['windowMs'] as number;
  if (!Number.isFinite(windowMs) || !Number.isInteger(windowMs) || windowMs <= 0) {
    throw new RangeError('windowMs must be a positive integer');
  }

  if (typeof record['burst'] !== 'number') {
    throw new TypeError('burst must be a number');
  }
  const burst = record['burst'] as number;
  if (!Number.isFinite(burst) || !Number.isInteger(burst) || burst <= 0) {
    throw new RangeError('burst must be a positive integer');
  }

  if (burst < requests) {
    throw new RangeError('burst must be >= requests');
  }

  return { requests, windowMs, burst };
}