// bloom-deps:

function evaluateFeatureFlag(
  flag: { enabled: boolean; rolloutPercentage?: number; allowlist?: string[]; denylist?: string[] },
  userId: string
): boolean {
  // Validate flag: must be a plain object (not null, not array, not other)
  if (
    typeof flag !== 'object' ||
    flag === null ||
    Array.isArray(flag) ||
    Object.getPrototypeOf(flag) !== Object.prototype
  ) {
    throw new TypeError('flag must be a plain object');
  }

  // Validate userId: must be a non-empty string
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new TypeError('userId must be a non-empty string');
  }

  // Validate rolloutPercentage if provided
  if (flag.rolloutPercentage !== undefined) {
    if (
      typeof flag.rolloutPercentage !== 'number' ||
      !isFinite(flag.rolloutPercentage) ||
      flag.rolloutPercentage < 0 ||
      flag.rolloutPercentage > 100
    ) {
      throw new RangeError('rolloutPercentage must be a number in the range [0, 100]');
    }
  }

  // If flag is disabled, always return false
  if (!flag.enabled) {
    return false;
  }

  // If userId is in denylist, return false
  if (Array.isArray(flag.denylist) && flag.denylist.includes(userId)) {
    return false;
  }

  // If userId is in allowlist, return true
  if (Array.isArray(flag.allowlist) && flag.allowlist.includes(userId)) {
    return true;
  }

  // Determine rollout percentage (default 100)
  const rolloutPercentage = flag.rolloutPercentage !== undefined ? flag.rolloutPercentage : 100;

  // Compute deterministic hash: sum of char codes modulo 100
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash += userId.charCodeAt(i);
  }
  const hashValue = hash % 100;

  // User falls within rollout if hashValue < rolloutPercentage
  return hashValue < rolloutPercentage;
}

export { evaluateFeatureFlag };