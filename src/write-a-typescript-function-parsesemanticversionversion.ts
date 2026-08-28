// bloom-deps:

function parseSemanticVersion(version: unknown): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  build: string | null;
} {
  if (typeof version !== "string") {
    throw new TypeError("version must be a string");
  }

  // Match semver pattern: MAJOR.MINOR.PATCH[-prerelease][+build]
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([^+]*))?(?:\+(.*))?$/;
  const match = version.match(semverRegex);

  if (!match) {
    throw new RangeError("version does not match the semver pattern");
  }

  const majorStr = match[1];
  const minorStr = match[2];
  const patchStr = match[3];
  const prereleaseStr = match[4] !== undefined ? match[4] : null;
  const buildStr = match[5] !== undefined ? match[5] : null;

  // Ensure segments are pure integers (no leading zeros beyond single "0", no floats)
  // The regex already ensures they are digit-only, but we need to check for non-integer patterns
  // Since regex \d+ already prevents floats and non-digits, we just need to check negative
  // (negative can't appear due to regex, but the spec says to throw RangeError for negative)

  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  const patch = parseInt(patchStr, 10);

  // Check for non-integer: since regex guarantees digit-only strings, parseInt will always
  // produce an integer. However, we need to guard against cases like "1.2.3.4" which
  // the regex would fail to match, already handled above.
  // Negative integers can't come from \d+ regex, but spec says to check.
  if (major < 0 || minor < 0 || patch < 0) {
    throw new RangeError("MAJOR, MINOR, and PATCH must not be negative integers");
  }

  // Validate that the stringified integers match the original segments
  // This catches leading zeros like "01" which would indicate non-standard version segments
  // However, semver does allow "0" but not "01". We'll be permissive unless spec states otherwise.
  // The spec says "not integers (e.g. 1.2.3.4 or float-like segments)" — the regex handles 1.2.3.4
  // by not matching it, and float-like (e.g. "1.2.3-" with empty prerelease is fine).

  return {
    major,
    minor,
    patch,
    prerelease: prereleaseStr,
    build: buildStr,
  };
}

export { parseSemanticVersion };