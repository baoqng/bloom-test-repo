// bloom-deps:

function evaluateFeatureFlag(
  flag: { enabled: boolean; rolloutPercentage?: number; allowList?: string[]; denyList?: string[] },
  userId: string
): boolean {
  if (
    flag === null ||
    typeof flag !== 'object' ||
    Array.isArray(flag) ||
    Object.getPrototypeOf(flag) !== Object.prototype
  ) {
    throw new TypeError('flag must be a plain object');
  }

  if (typeof userId !== 'string' || userId.length === 0) {
    throw new TypeError('userId must be a non-empty string');
  }

  if (!flag.enabled) {
    return false;
  }

  if (flag.denyList !== undefined && Array.isArray(flag.denyList) && flag.denyList.includes(userId)) {
    return false;
  }

  if (flag.allowList !== undefined && Array.isArray(flag.allowList) && flag.allowList.includes(userId)) {
    return true;
  }

  if (flag.rolloutPercentage !== undefined) {
    const rp = flag.rolloutPercentage;
    if (!Number.isFinite(rp) || rp < 0 || rp > 100) {
      throw new RangeError('rolloutPercentage must be a number between 0 and 100');
    }

    let hashValue = 0;
    for (let i = 0; i < userId.length; i++) {
      hashValue += userId.charCodeAt(i);
    }
    const bucket = hashValue % 100;

    return bucket < rp;
  }

  return true;
}

export { evaluateFeatureFlag };