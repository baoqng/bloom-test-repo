// bloom-deps:

export function parseVersionTag(tag: unknown): { major: number; minor: number; patch: number; preRelease: string | null } {
  if (typeof tag !== 'string') {
    throw new TypeError('tag must be a string');
  }

  const trimmed = tag.trim();

  if (trimmed.length === 0) {
    throw new RangeError('tag must not be empty');
  }

  let rest = trimmed;
  if (rest[0] === 'v' || rest[0] === 'V') {
    rest = rest.slice(1);
  }

  // Split on '-' to separate version from pre-release, using indexOf+slice
  const dashIndex = rest.indexOf('-');

  let versionPart: string;
  let preReleasePart: string | null = null;

  if (dashIndex !== -1) {
    versionPart = rest.slice(0, dashIndex);
    const afterDash = rest.slice(dashIndex + 1);
    if (afterDash.length === 0) {
      throw new RangeError('pre-release must not be empty');
    }
    preReleasePart = afterDash;
  } else {
    versionPart = rest;
  }

  // Split version part on '.' using indexOf+slice
  const firstDot = versionPart.indexOf('.');
  if (firstDot === -1) {
    throw new RangeError('tag must be a valid version string');
  }

  const majorStr = versionPart.slice(0, firstDot);
  const remaining = versionPart.slice(firstDot + 1);

  const secondDot = remaining.indexOf('.');
  if (secondDot === -1) {
    throw new RangeError('tag must be a valid version string');
  }

  const minorStr = remaining.slice(0, secondDot);
  const patchStr = remaining.slice(secondDot + 1);

  // Validate each part: must be non-empty, digits only, no leading zeros
  const noLeadingZerosRegex = /^(0|[1-9][0-9]*)$/;

  if (!noLeadingZerosRegex.test(majorStr)) {
    throw new RangeError('tag must be a valid version string');
  }
  if (!noLeadingZerosRegex.test(minorStr)) {
    throw new RangeError('tag must be a valid version string');
  }
  if (!noLeadingZerosRegex.test(patchStr)) {
    throw new RangeError('tag must be a valid version string');
  }

  // Check for extra dots in patchStr
  if (patchStr.indexOf('.') !== -1) {
    throw new RangeError('tag must be a valid version string');
  }

  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  const patch = parseInt(patchStr, 10);

  return {
    major,
    minor,
    patch,
    preRelease: preReleasePart,
  };
}