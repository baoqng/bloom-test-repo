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

  // If disabled, return false immediately
  if (flag.enabled === false) {
    return false;
  }

  // Check denyList
  if (flag.denyList !== undefined && Array.isArray(flag.denyList)) {
    if (flag.denyList.some((entry) => entry === userId)) {
      return false;
    }
  }

  // Check allowList
  if (flag.allowList !== undefined && Array.isArray(flag.allowList)) {
    if (flag.allowList.some((entry) => entry === userId)) {
      return true;
    }
  }

  // Check rolloutPercentage
  if (flag.rolloutPercentage !== undefined) {
    const rp = flag.rolloutPercentage;
    if (!Number.isFinite(rp) || rp < 0 || rp > 100) {
      throw new RangeError('rolloutPercentage must be a number between 0 and 100');
    }

    // Compute deterministic hash: sum of char codes modulo 100
    let sum = 0;
    for (let i = 0; i < userId.length; i++) {
      sum += userId.charCodeAt(i);
    }
    const hashValue = sum % 100;

    return hashValue < rp;
  }

  // No rollout percentage, allowList did not match, feature is enabled
  return true;
}

export { evaluateFeatureFlag };