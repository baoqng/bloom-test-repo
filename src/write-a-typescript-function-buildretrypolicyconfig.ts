// bloom-deps:

function buildRetryPolicy(config: unknown): {
  shouldRetry: (attempt: number, statusCode: number) => boolean;
  delayMs: (attempt: number) => number;
} {
  // Validate config is a plain object
  if (
    typeof config !== "object" ||
    config === null ||
    Array.isArray(config) ||
    Object.getPrototypeOf(config) !== Object.prototype
  ) {
    throw new TypeError("config must be a plain object");
  }

  const cfg = config as Record<string, unknown>;

  // Validate attempts
  if (!Number.isInteger(cfg.attempts) || (cfg.attempts as number) < 1) {
    throw new RangeError("attempts must be a positive integer");
  }
  const attempts = cfg.attempts as number;

  // Validate backoffMs
  if (
    typeof cfg.backoffMs !== "number" ||
    !Number.isFinite(cfg.backoffMs) ||
    (cfg.backoffMs as number) <= 0
  ) {
    throw new RangeError("backoffMs must be a positive finite number");
  }
  const backoffMs = cfg.backoffMs as number;

  // Validate and set backoffMultiplier (defaults to 2)
  let backoffMultiplier = 2;
  if (cfg.backoffMultiplier !== undefined) {
    if (
      typeof cfg.backoffMultiplier !== "number" ||
      !Number.isFinite(cfg.backoffMultiplier) ||
      (cfg.backoffMultiplier as number) < 1
    ) {
      throw new RangeError("backoffMultiplier must be >= 1");
    }
    backoffMultiplier = cfg.backoffMultiplier as number;
  }

  // Validate and set maxBackoffMs (defaults to 30000)
  let maxBackoffMs = 30000;
  if (cfg.maxBackoffMs !== undefined) {
    if (
      typeof cfg.maxBackoffMs !== "number" ||
      !Number.isFinite(cfg.maxBackoffMs) ||
      (cfg.maxBackoffMs as number) < backoffMs
    ) {
      throw new RangeError("maxBackoffMs must be >= backoffMs");
    }
    maxBackoffMs = cfg.maxBackoffMs as number;
  }

  // Validate and set retryableStatuses (defaults to [429, 500, 502, 503, 504])
  let retryableStatuses: number[] = [429, 500, 502, 503, 504];
  if (cfg.retryableStatuses !== undefined) {
    if (!Array.isArray(cfg.retryableStatuses)) {
      throw new TypeError("retryableStatuses must be an array");
    }
    retryableStatuses = cfg.retryableStatuses as number[];
  }

  return {
    shouldRetry: (attempt: number, statusCode: number): boolean => {
      // attempt is 0-indexed; return false if we've exhausted attempts
      if (attempt >= attempts - 1) {
        return false;
      }
      // Return true if statusCode is in retryableStatuses
      return retryableStatuses.includes(statusCode);
    },
    delayMs: (attempt: number): number => {
      return Math.min(
        backoffMs * Math.pow(backoffMultiplier, attempt),
        maxBackoffMs
      );
    },
  };
}

export { buildRetryPolicy };