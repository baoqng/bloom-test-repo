// bloom-deps:

function validateVersionConstraint(constraint: unknown): { operator: string; major: number; minor: number | null; patch: number | null } {
  if (typeof constraint !== 'string') {
    throw new TypeError('constraint must be a string');
  }

  if (constraint.trim() === '') {
    throw new RangeError('constraint must not be empty');
  }

  const trimmed = constraint.trim();

  // Extract operator
  let operator = '';
  let versionStr = trimmed;

  if (trimmed.startsWith('>=')) {
    operator = '>=';
    versionStr = trimmed.slice(2);
  } else if (trimmed.startsWith('<=')) {
    operator = '<=';
    versionStr = trimmed.slice(2);
  } else if (trimmed.startsWith('>')) {
    operator = '>';
    versionStr = trimmed.slice(1);
  } else if (trimmed.startsWith('<')) {
    operator = '<';
    versionStr = trimmed.slice(1);
  } else if (trimmed.startsWith('^')) {
    operator = '^';
    versionStr = trimmed.slice(1);
  } else if (trimmed.startsWith('~')) {
    operator = '~';
    versionStr = trimmed.slice(1);
  } else if (trimmed.startsWith('=')) {
    operator = '=';
    versionStr = trimmed.slice(1);
  } else if (/^\d/.test(trimmed)) {
    operator = '';
    versionStr = trimmed;
  } else {
    throw new RangeError('invalid operator');
  }

  // Version string must start with a digit
  if (versionStr.length === 0 || !/^\d/.test(versionStr)) {
    throw new RangeError('major version is required');
  }

  // Split version into components
  const parts = versionStr.split('.');

  if (parts.length > 3) {
    throw new RangeError('invalid version number');
  }

  const isValidComponent = (s: string): boolean => {
    if (s.length === 0) return false;
    if (!/^\d+$/.test(s)) return false;
    // No leading zeros except '0' itself
    if (s.length > 1 && s.startsWith('0')) return false;
    return true;
  };

  // Major is required
  if (parts.length === 0 || !isValidComponent(parts[0])) {
    if (parts.length === 0) {
      throw new RangeError('major version is required');
    }
    throw new RangeError('invalid version number');
  }

  const major = parseInt(parts[0], 10);

  let minor: number | null = null;
  let patch: number | null = null;

  if (parts.length >= 2) {
    if (!isValidComponent(parts[1])) {
      throw new RangeError('invalid version number');
    }
    minor = parseInt(parts[1], 10);
  }

  if (parts.length === 3) {
    if (!isValidComponent(parts[2])) {
      throw new RangeError('invalid version number');
    }
    patch = parseInt(parts[2], 10);
  }

  return { operator, major, minor, patch };
}

export { validateVersionConstraint };