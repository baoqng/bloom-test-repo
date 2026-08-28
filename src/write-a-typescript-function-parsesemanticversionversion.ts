// bloom-deps:

export function parseSemanticVersion(version: unknown): {
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
    throw new RangeError(
      "version does not match the semver pattern MAJOR.MINOR.PATCH[-prerelease][+build]"
    );
  }

  const majorStr = match[1];
  const minorStr = match[2];
  const patchStr = match[3];
  const prereleaseStr = match[4] !== undefined ? match[4] : null;
  const buildStr = match[5] !== undefined ? match[5] : null;

  // Validate that segments are integer strings (no leading zeros beyond "0", no floats)
  // The regex already ensures digits only, but we need to check for non-integer cases
  // like "1.2.3.4" (already rejected by regex) — validate no extra dots
  // Also reject leading zeros for multi-digit numbers? The spec says "not integers"
  // The spec example "1.2.3.4 or float-like segments" - regex handles this

  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  const patch = parseInt(patchStr, 10);

  // Check for non-integer (float-like) segments - if the parsed integer
  // doesn't reconstruct to the original string, it's not a plain integer
  if (major.toString() !== majorStr) {
    throw new RangeError("MAJOR must be an integer");
  }
  if (minor.toString() !== minorStr) {
    throw new RangeError("MINOR must be an integer");
  }
  if (patch.toString() !== patchStr) {
    throw new RangeError("PATCH must be an integer");
  }

  if (major < 0) {
    throw new RangeError("MAJOR must not be negative");
  }
  if (minor < 0) {
    throw new RangeError("MINOR must not be negative");
  }
  if (patch < 0) {
    throw new RangeError("PATCH must not be negative");
  }

  return {
    major,
    minor,
    patch,
    prerelease: prereleaseStr,
    build: buildStr,
  };
}