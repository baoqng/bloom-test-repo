// bloom-deps:

export function parseVersionRange(input: unknown): {
  operator: string;
  major: number;
  minor: number | null;
  patch: number | null;
} {
  // Validate input type and non-empty string
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("input must be a non-empty string");
  }

  // List of valid operators
  const validOperators = [">=", "<=", ">", "<", "=", "^", "~"];

  // Find which operator matches at the start
  let operator: string | null = null;
  for (const op of validOperators) {
    if (input.startsWith(op)) {
      operator = op;
      break;
    }
  }

  // If no valid operator found, throw SyntaxError
  if (operator === null) {
    throw new SyntaxError("Not a valid version range");
  }

  // Extract the version part after the operator
  const versionPart = input.slice(operator.length).trim();

  // If no version after operator, throw SyntaxError
  if (versionPart.length === 0) {
    throw new SyntaxError("Not a valid version range");
  }

  // Split version by dots
  const parts = versionPart.split(".");
  let hasValidEntry = false;

  // Parse major version (required)
  let major: number | null = null;

  // Process major version
  if (parts.length > 0) {
    const majorStr = parts[0];
    if (majorStr.length > 0 && /^\d+$/.test(majorStr)) {
      major = parseInt(majorStr, 10);
      if (major < 0) {
        throw new RangeError("Version components must be non-negative integers");
      }
      hasValidEntry = true;
    } else if (majorStr.length === 0) {
      throw new SyntaxError("Not a valid version range");
    } else {
      throw new RangeError("Version components must be non-negative integers");
    }
  }

  // Guard: ensure we found a valid major version
  if (!hasValidEntry) {
    throw new SyntaxError("Not a valid version range");
  }

  // Parse minor version (optional)
  let minor: number | null = null;
  if (parts.length > 1) {
    const minorStr = parts[1];
    if (minorStr.length > 0 && /^\d+$/.test(minorStr)) {
      minor = parseInt(minorStr, 10);
      if (minor < 0) {
        throw new RangeError("Version components must be non-negative integers");
      }
    } else if (minorStr.length === 0) {
      throw new SyntaxError("Not a valid version range");
    } else {
      throw new RangeError("Version components must be non-negative integers");
    }
  }

  // Parse patch version (optional)
  let patch: number | null = null;
  if (parts.length > 2) {
    const patchStr = parts[2];
    if (patchStr.length > 0 && /^\d+$/.test(patchStr)) {
      patch = parseInt(patchStr, 10);
      if (patch < 0) {
        throw new RangeError("Version components must be non-negative integers");
      }
    } else if (patchStr.length === 0) {
      throw new SyntaxError("Not a valid version range");
    } else {
      throw new RangeError("Version components must be non-negative integers");
    }
  }

  // Reject if there are more than 3 version components
  if (parts.length > 3) {
    throw new SyntaxError("Not a valid version range");
  }

  return {
    operator,
    major,
    minor,
    patch,
  };
}