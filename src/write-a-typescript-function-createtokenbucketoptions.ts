// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) return false;
  let proto = v;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(v) === proto;
}

interface Bucket {
  tokens: number;
  lastCheck: number;
}

export function createTokenBucket(options: {
  capacity: number;
  refillRatePerMs: number;
  initialTokens?: number;
}): {
  check: (key: string) => boolean;
  reset: (key: string) => void;
  resetAll: () => void;
} {
  if (!isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const { capacity, refillRatePerMs, initialTokens: initialTokensOption } = options as {
    capacity: number;
    refillRatePerMs: number;
    initialTokens?: number;
  };

  if (
    typeof capacity !== 'number' ||
    !Number.isFinite(capacity) ||
    capacity <= 0
  ) {
    throw new RangeError('capacity must be a positive finite number');
  }

  if (
    typeof refillRatePerMs !== 'number' ||
    !Number.isFinite(refillRatePerMs) ||
    refillRatePerMs <= 0
  ) {
    throw new RangeError('refillRatePerMs must be a positive finite number');
  }

  let initialTokens: number;
  if (initialTokensOption === undefined) {
    initialTokens = capacity;
  } else {
    if (
      typeof initialTokensOption !== 'number' ||
      !Number.isFinite(initialTokensOption) ||
      initialTokensOption < 0 ||
      initialTokensOption > capacity
    ) {
      throw new RangeError('initialTokens must be a finite number between 0 and capacity');
    }
    initialTokens = initialTokensOption;
  }

  const buckets = new Map<string, Bucket>();

  function validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('key must be a non-empty string');
    }
  }

  function check(key: string): boolean {
    validateKey(key);

    if (!buckets.has(key)) {
      buckets.set(key, {
        tokens: initialTokens,
        lastCheck: Date.now(),
      });
    }

    const bucket = buckets.get(key)!;
    const now = Date.now();
    const elapsedMs = now - bucket.lastCheck;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMs * refillRatePerMs);
    bucket.lastCheck = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }

    return false;
  }

  function reset(key: string): void {
    validateKey(key);
    buckets.set(key, {
      tokens: initialTokens,
      lastCheck: Date.now(),
    });
  }

  function resetAll(): void {
    buckets.clear();
  }

  return { check, reset, resetAll };
}