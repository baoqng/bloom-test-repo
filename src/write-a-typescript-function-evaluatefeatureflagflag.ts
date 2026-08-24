// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function hashUserId(userId: string): number {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }
  return sum % 100;
}

export function evaluateFeatureFlag(
  flag: {
    enabled: boolean;
    rolloutPercentage?: number;
    allowlist?: string[];
    denylist?: string[];
  },
  userId: string
): boolean {
  // Validate flag is a plain object
  if (!isPlainObject(flag)) {
    throw new TypeError('flag must be a plain object');
  }

  // Validate userId is a non-empty string
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new TypeError('userId must be a non-empty string');
  }

  // Validate rolloutPercentage if provided
  if (flag.rolloutPercentage !== undefined) {
    if (
      typeof flag.rolloutPercentage !== 'number' ||
      flag.rolloutPercentage < 0 ||
      flag.rolloutPercentage > 100
    ) {
      throw new RangeError('rolloutPercentage must be between 0 and 100 inclusive');
    }
  }

  // If flag is disabled, always return false
  if (!flag.enabled) {
    return false;
  }

  // Check denylist
  if (Array.isArray(flag.denylist) && flag.denylist.includes(userId)) {
    return false;
  }

  // Check allowlist
  if (Array.isArray(flag.allowlist) && flag.allowlist.includes(userId)) {
    return true;
  }

  // Determine rollout percentage (default 100)
  const rolloutPercentage = flag.rolloutPercentage !== undefined ? flag.rolloutPercentage : 100;

  // Use deterministic hash to evaluate rollout
  const hash = hashUserId(userId);

  // hash is in [0, 99]; user is within rollout if hash < rolloutPercentage
  return hash < rolloutPercentage;
}