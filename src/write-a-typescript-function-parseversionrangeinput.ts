// bloom-deps:

export function parseVersionRange(input: unknown): {
  operator: string;
  major: number;
  minor: number | null;
  patch: number | null;
} {
  // Type check: input must be a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const str = input.trim();

  // Recognized operators
  const operators = ['>=', '<=', '>', '<', '=', '^', '~'];
  let operator: string | null = null;
  let versionPart: string | null = null;

  // Extract operator
  for (const op of operators) {
    if (str.startsWith(op)) {
      operator = op;
      versionPart = str.slice(op.length).trim();
      break;
    }
  }

  if (operator === null) {
    throw new SyntaxError('Not a valid version range');
  }

  if (versionPart === null || versionPart.length === 0) {
    throw new SyntaxError('Not a valid version range');
  }

  // Split version by dots
  const parts = versionPart.split('.');
  
  if (parts.length === 0) {
    throw new SyntaxError('Not a valid version range');
  }

  // Check if first part is numeric
  if (!/^\d+$/.test(parts[0])) {
    throw new RangeError('Version components must be non-negative integers');
  }

  const major = parseInt(parts[0], 10);

  if (major < 0) {
    throw new RangeError('Version components must be non-negative integers');
  }

  let minor: number | null = null;
  let patch: number | null = null;

  // Parse minor version if present
  if (parts.length > 1) {
    if (!/^\d+$/.test(parts[1])) {
      throw new RangeError('Version components must be non-negative integers');
    }

    minor = parseInt(parts[1], 10);

    if (minor < 0) {
      throw new RangeError('Version components must be non-negative integers');
    }
  }

  // Parse patch version if present
  if (parts.length > 2) {
    if (!/^\d+$/.test(parts[2])) {
      throw new RangeError('Version components must be non-negative integers');
    }

    patch = parseInt(parts[2], 10);

    if (patch < 0) {
      throw new RangeError('Version components must be non-negative integers');
    }
  }

  // Check for extra parts (invalid format like 1.2.3.4)
  if (parts.length > 3) {
    throw new SyntaxError('Not a valid version range');
  }

  return {
    operator,
    major,
    minor,
    patch
  };
}