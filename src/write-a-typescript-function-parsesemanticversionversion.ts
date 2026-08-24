// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseSemanticVersion(version: unknown): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  build: string | null;
} {
  // [REQUIRED] typeof check for string input
  if (typeof version !== 'string') {
    throw new TypeError('version must be a string');
  }

  // [REQUIRED] Validate maxLength and format for string inputs
  if (version.length === 0 || version.length > 256) {
    throw new RangeError('version string must be non-empty and not exceed 256 characters');
  }

  // Regex pattern for semantic versioning: MAJOR.MINOR.PATCH[-prerelease][+build]
  // MAJOR, MINOR, PATCH are non-negative integers
  // prerelease and build are optional alphanumeric segments
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-z-]+(?:\.[\da-z-]+)*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i;

  const match = version.match(semverRegex);

  if (!match) {
    throw new RangeError(`version string does not match semantic version pattern: ${version}`);
  }

  const majorStr = match[1];
  const minorStr = match[2];
  const patchStr = match[3];
  const prereleaseStr = match[4] ?? null;
  const buildStr = match[5] ?? null;

  // Parse and validate MAJOR, MINOR, PATCH
  let major: number;
  let minor: number;
  let patch: number;

  try {
    major = parseInt(majorStr, 10);
    minor = parseInt(minorStr, 10);
    patch = parseInt(patchStr, 10);
  } catch (error) {
    throw new RangeError('Failed to parse version numbers', { cause: error });
  }

  // [REQUIRED] Validate that parsed numbers are non-negative integers
  if (!Number.isInteger(major) || major < 0) {
    throw new RangeError(`MAJOR version must be a non-negative integer, got: ${major}`);
  }

  if (!Number.isInteger(minor) || minor < 0) {
    throw new RangeError(`MINOR version must be a non-negative integer, got: ${minor}`);
  }

  if (!Number.isInteger(patch) || patch < 0) {
    throw new RangeError(`PATCH version must be a non-negative integer, got: ${patch}`);
  }

  return {
    major,
    minor,
    patch,
    prerelease: prereleaseStr,
    build: buildStr,
  };
}