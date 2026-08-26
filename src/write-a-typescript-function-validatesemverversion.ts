// bloom-deps:

export function validateSemVer(version: unknown): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  buildMetadata: string | null;
} {
  if (typeof version !== 'string') {
    throw new TypeError('version must be a string');
  }

  if (version.trim().length === 0) {
    throw new RangeError('version must not be empty');
  }

  let trimmed = version.trim();

  // Strip leading 'v' or 'V'
  if (trimmed.startsWith('v') || trimmed.startsWith('V')) {
    trimmed = trimmed.substring(1);
  }

  // Extract build metadata first (after '+')
  let buildMetadata: string | null = null;
  const plusIndex = trimmed.indexOf('+');
  if (plusIndex !== -1) {
    buildMetadata = trimmed.substring(plusIndex + 1);
    trimmed = trimmed.substring(0, plusIndex);
  }

  // Extract prerelease (after '-')
  let prerelease: string | null = null;
  const dashIndex = trimmed.indexOf('-');
  if (dashIndex !== -1) {
    prerelease = trimmed.substring(dashIndex + 1);
    trimmed = trimmed.substring(0, dashIndex);
  }

  // Now trimmed should be MAJOR.MINOR.PATCH
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    throw new RangeError('invalid semver format');
  }

  const [majorStr, minorStr, patchStr] = parts;

  const validateComponent = (str: string): number => {
    // Must be non-empty
    if (str.length === 0) {
      throw new RangeError('invalid semver format');
    }
    // Must contain only digits
    if (!/^\d+$/.test(str)) {
      throw new RangeError('invalid semver format');
    }
    // No leading zeros (except '0' itself)
    if (str.length > 1 && str.startsWith('0')) {
      throw new RangeError('invalid semver format');
    }
    return parseInt(str, 10);
  };

  const major = validateComponent(majorStr);
  const minor = validateComponent(minorStr);
  const patch = validateComponent(patchStr);

  return {
    major,
    minor,
    patch,
    prerelease,
    buildMetadata,
  };
}