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

  const trimmed = version.trim();
  if (trimmed.length === 0) {
    throw new RangeError('version must not be empty');
  }

  // Strip leading 'v' or 'V'
  let str = trimmed;
  if (str[0] === 'v' || str[0] === 'V') {
    str = str.slice(1);
  }

  // Extract build metadata (after '+')
  let buildMetadata: string | null = null;
  const plusIdx = str.indexOf('+');
  if (plusIdx !== -1) {
    buildMetadata = str.slice(plusIdx + 1);
    str = str.slice(0, plusIdx);
  }

  // Extract prerelease (after '-')
  let prerelease: string | null = null;
  const dashIdx = str.indexOf('-');
  if (dashIdx !== -1) {
    prerelease = str.slice(dashIdx + 1);
    str = str.slice(0, dashIdx);
  }

  // Now str should be MAJOR.MINOR.PATCH
  // Count dots - must be exactly 2
  let dotCount = 0;
  let idx = 0;
  while (idx !== -1) {
    idx = str.indexOf('.', idx);
    if (idx !== -1) {
      dotCount++;
      idx++;
    }
  }

  if (dotCount !== 2) {
    throw new RangeError('invalid semver format');
  }

  // Extract MAJOR using indexOf+slice
  const firstDot = str.indexOf('.');
  if (firstDot === -1) {
    throw new RangeError('invalid semver format');
  }
  const majorStr = str.slice(0, firstDot);
  const rest = str.slice(firstDot + 1);

  const secondDot = rest.indexOf('.');
  if (secondDot === -1) {
    throw new RangeError('invalid semver format');
  }
  const minorStr = rest.slice(0, secondDot);
  const patchStr = rest.slice(secondDot + 1);

  // Validate each component
  const validateComponent = (s: string): number => {
    if (s.length === 0) {
      throw new RangeError('invalid semver format');
    }
    // Must contain only digits
    if (!/^\d+$/.test(s)) {
      throw new RangeError('invalid semver format');
    }
    // No leading zeros (except '0' itself)
    if (s.length > 1 && s[0] === '0') {
      throw new RangeError('invalid semver format');
    }
    return parseInt(s, 10);
  };

  const major = validateComponent(majorStr);
  const minor = validateComponent(minorStr);
  const patch = validateComponent(patchStr);

  return {
    major,
    minor,
    patch,
    prerelease: prerelease !== null ? prerelease : null,
    buildMetadata: buildMetadata !== null ? buildMetadata : null,
  };
}