// bloom-deps:

function evaluateFeatureFlag(
  flag: { enabled: boolean; rolloutPercentage?: number; allowList?: string[]; denyList?: string[] },
  userId: string
): boolean {
  // Validate flag is a plain object
  if (
    flag === null ||
    typeof flag !== 'object' ||
    Array.isArray(flag) ||
    Object.getPrototypeOf(flag) !== Object.prototype
  ) {
    throw new TypeError('flag must be a plain object');
  }

  // Validate userId is a non-empty string
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new TypeError('userId must be a non-empty string');
  }

  // If flag is not enabled, return false immediately
  if (flag.enabled === false) {
    return false;
  }

  // Check denyList
  if (flag.denyList !== undefined && flag.denyList.includes(userId)) {
    return false;
  }

  // Check allowList
  if (flag.allowList !== undefined && flag.allowList.includes(userId)) {
    return true;
  }

  // Check rolloutPercentage
  if (flag.rolloutPercentage !== undefined) {
    if (
      typeof flag.rolloutPercentage !== 'number' ||
      !Number.isFinite(flag.rolloutPercentage) ||
      flag.rolloutPercentage < 0 ||
      flag.rolloutPercentage > 100
    ) {
      throw new RangeError('rolloutPercentage must be a number between 0 and 100');
    }

    // Compute deterministic hash: sum of char codes modulo 100
    let sum = 0;
    for (let i = 0; i < userId.length; i++) {
      sum += userId.charCodeAt(i);
    }
    const hashValue = sum % 100;

    return hashValue < flag.rolloutPercentage;
  }

  // No rollout percentage and allowList did not match: fully enabled
  return true;
}

export { evaluateFeatureFlag };