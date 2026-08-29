// bloom-deps:

function parseVersionBump(current: unknown, bump: unknown): string {
  // Validate current parameter
  if (typeof current !== 'string' || current.length === 0) {
    throw new TypeError('current must be a non-empty string');
  }

  // Validate bump parameter
  if (bump !== 'major' && bump !== 'minor' && bump !== 'patch') {
    throw new TypeError("bump must be 'major', 'minor', or 'patch'");
  }

  // Parse and validate semver format
  const parts = current.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('current is not a valid semver');
  }

  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2], 10);

  // Validate that all parts are non-negative integers
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    throw new SyntaxError('current is not a valid semver');
  }

  // Validate no leading zeros (except for "0" itself)
  if (
    (parts[0] !== '0' && parts[0][0] === '0') ||
    (parts[1] !== '0' && parts[1][0] === '0') ||
    (parts[2] !== '0' && parts[2][0] === '0')
  ) {
    throw new SyntaxError('current is not a valid semver');
  }

  // Validate that parsed values match original string parts (no negative signs, etc.)
  if (major < 0 || minor < 0 || patch < 0) {
    throw new SyntaxError('current is not a valid semver');
  }

  // Validate string representation matches parsed integers
  if (major.toString() !== parts[0] || minor.toString() !== parts[1] || patch.toString() !== parts[2]) {
    throw new SyntaxError('current is not a valid semver');
  }

  // Compute next version based on bump type
  let nextMajor = major;
  let nextMinor = minor;
  let nextPatch = patch;

  if (bump === 'major') {
    nextMajor = major + 1;
    nextMinor = 0;
    nextPatch = 0;
  } else if (bump === 'minor') {
    nextMinor = minor + 1;
    nextPatch = 0;
  } else if (bump === 'patch') {
    nextPatch = patch + 1;
  }

  return `${nextMajor}.${nextMinor}.${nextPatch}`;
}

export { parseVersionBump };