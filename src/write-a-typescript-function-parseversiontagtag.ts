// bloom-deps:

function parseVersionTag(tag: unknown): { major: number; minor: number; patch: number; preRelease: string | null; isPreRelease: boolean } {
  if (typeof tag !== 'string') {
    throw new TypeError('Expected a string');
  }

  const pattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*))?$/;
  const match = tag.match(pattern);

  if (!match) {
    throw new SyntaxError('Invalid version tag');
  }

  const [, majorStr, minorStr, patchStr, preReleaseStr] = match;

  // Check for leading zeros
  if (majorStr.length > 1 && majorStr.startsWith('0')) {
    throw new SyntaxError('Invalid version tag');
  }
  if (minorStr.length > 1 && minorStr.startsWith('0')) {
    throw new SyntaxError('Invalid version tag');
  }
  if (patchStr.length > 1 && patchStr.startsWith('0')) {
    throw new SyntaxError('Invalid version tag');
  }

  const major = Number(majorStr);
  const minor = Number(minorStr);
  const patch = Number(patchStr);
  const preRelease = preReleaseStr !== undefined ? preReleaseStr : null;
  const isPreRelease = preRelease !== null;

  return { major, minor, patch, preRelease, isPreRelease };
}

export { parseVersionTag };