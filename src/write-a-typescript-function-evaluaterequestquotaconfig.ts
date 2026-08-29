// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

function isNonNegativeFinite(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function evaluateRequestQuota(
  config: { limit: number; windowMs: number; burstLimit: number },
  usage: { count: number; windowStartMs: number; burstCount: number; burstWindowStartMs: number },
  nowMs: number
): {
  allowed: boolean;
  reason: 'ok' | 'rate_limited' | 'burst_limited';
  remainingQuota: number;
  remainingBurst: number;
  retryAfterMs: number | null;
} {
  // Validate config
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }
  if (!isPositiveInteger(config.limit)) {
    throw new RangeError('config.limit must be a positive integer');
  }
  if (!isPositiveInteger(config.windowMs)) {
    throw new RangeError('config.windowMs must be a positive integer');
  }
  if (!isPositiveInteger(config.burstLimit)) {
    throw new RangeError('config.burstLimit must be a positive integer');
  }

  // Validate usage
  if (!isPlainObject(usage)) {
    throw new TypeError('usage must be a plain object');
  }
  if (!isNonNegativeInteger(usage.count)) {
    throw new RangeError('usage.count must be a non-negative integer');
  }
  if (!isNonNegativeFinite(usage.windowStartMs)) {
    throw new RangeError('usage.windowStartMs must be a non-negative finite number');
  }
  if (!isNonNegativeInteger(usage.burstCount)) {
    throw new RangeError('usage.burstCount must be a non-negative integer');
  }
  if (!isNonNegativeFinite(usage.burstWindowStartMs)) {
    throw new RangeError('usage.burstWindowStartMs must be a non-negative finite number');
  }

  // Validate nowMs
  if (typeof nowMs !== 'number' || !Number.isFinite(nowMs)) {
    throw new TypeError('nowMs must be a finite number');
  }
  if (nowMs < 0) {
    throw new RangeError('nowMs must be >= 0');
  }

  // Sliding-window check
  const effectiveCount = usage.windowStartMs < nowMs - config.windowMs ? 0 : usage.count;
  const rateLimited = effectiveCount >= config.limit;
  const remainingQuota = rateLimited
    ? Math.max(0, config.limit - effectiveCount)
    : Math.max(0, config.limit - effectiveCount - 1);
  const rateRetryAfterMs = usage.windowStartMs + config.windowMs - nowMs;

  // Burst check (fixed 1000 ms window)
  const effectiveBurst = usage.burstWindowStartMs < nowMs - 1000 ? 0 : usage.burstCount;
  const burstLimited = effectiveBurst >= config.burstLimit;
  const remainingBurst = burstLimited
    ? Math.max(0, config.burstLimit - effectiveBurst)
    : Math.max(0, config.burstLimit - effectiveBurst - 1);
  const burstRetryAfterMs = usage.burstWindowStartMs + 1000 - nowMs;

  // Decision priority: burst check takes precedence
  if (burstLimited) {
    return {
      allowed: false,
      reason: 'burst_limited',
      remainingQuota,
      remainingBurst,
      retryAfterMs: burstRetryAfterMs,
    };
  }

  if (rateLimited) {
    return {
      allowed: false,
      reason: 'rate_limited',
      remainingQuota,
      remainingBurst,
      retryAfterMs: rateRetryAfterMs,
    };
  }

  return {
    allowed: true,
    reason: 'ok',
    remainingQuota,
    remainingBurst,
    retryAfterMs: null,
  };
}