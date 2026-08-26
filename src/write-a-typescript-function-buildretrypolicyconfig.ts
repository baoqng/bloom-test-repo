// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildRetryPolicy(config: unknown): {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFraction: number;
} {
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  const cfg = config as Record<string, unknown>;

  const maxAttempts = cfg.maxAttempts;
  if (
    typeof maxAttempts !== 'number' ||
    !isFinite(maxAttempts) ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }
  if (maxAttempts > 10) {
    throw new RangeError('maxAttempts must not exceed 10');
  }

  const initialDelayMs = cfg.initialDelayMs;
  if (
    typeof initialDelayMs !== 'number' ||
    !isFinite(initialDelayMs) ||
    !Number.isInteger(initialDelayMs) ||
    initialDelayMs <= 0
  ) {
    throw new TypeError('initialDelayMs must be a positive integer');
  }

  const maxDelayMs = cfg.maxDelayMs;
  if (
    typeof maxDelayMs !== 'number' ||
    !isFinite(maxDelayMs) ||
    !Number.isInteger(maxDelayMs) ||
    maxDelayMs <= 0
  ) {
    throw new TypeError('maxDelayMs must be a positive integer');
  }
  if (maxDelayMs < initialDelayMs) {
    throw new RangeError('maxDelayMs must be >= initialDelayMs');
  }

  const backoffMultiplier = cfg.backoffMultiplier;
  if (
    typeof backoffMultiplier !== 'number' ||
    !isFinite(backoffMultiplier) ||
    backoffMultiplier < 1
  ) {
    throw new TypeError('backoffMultiplier must be a number >= 1');
  }

  const jitterFraction = cfg.jitterFraction;
  if (
    typeof jitterFraction !== 'number' ||
    !isFinite(jitterFraction) ||
    jitterFraction < 0 ||
    jitterFraction > 1
  ) {
    throw new TypeError('jitterFraction must be a number between 0 and 1');
  }

  return {
    maxAttempts,
    initialDelayMs,
    maxDelayMs,
    backoffMultiplier,
    jitterFraction,
  };
}