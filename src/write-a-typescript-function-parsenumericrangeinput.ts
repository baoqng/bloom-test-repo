// bloom-deps:

function parseNumericRange(input: unknown): { min: number; max: number | null } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new RangeError('input must not be empty');
  }

  // Check Format 2: 'MIN+'
  if (trimmed.endsWith('+')) {
    const minStr = trimmed.slice(0, trimmed.length - 1);
    if (!/^\d+$/.test(minStr)) {
      throw new RangeError('input must be a valid range');
    }
    // Check for leading zeros
    if (minStr.length > 1 && minStr[0] === '0') {
      throw new RangeError('input must be a valid range');
    }
    const min = parseInt(minStr, 10);
    return { min, max: null };
  }

  // Check Format 1: 'MIN-MAX'
  // Use indexOf to find the first '-' and split on it
  const dashIndex = trimmed.indexOf('-');
  if (dashIndex !== -1) {
    const minStr = trimmed.slice(0, dashIndex);
    const maxStr = trimmed.slice(dashIndex + 1);

    // Validate both parts are non-negative integers with no leading zeros
    if (!/^\d+$/.test(minStr) || !/^\d+$/.test(maxStr)) {
      throw new RangeError('input must be a valid range');
    }

    // Check for leading zeros
    if ((minStr.length > 1 && minStr[0] === '0') || (maxStr.length > 1 && maxStr[0] === '0')) {
      throw new RangeError('input must be a valid range');
    }

    // Ensure maxStr contains no further '-' that would indicate additional segments
    // (already handled since we only split on first '-', maxStr could have more digits or '-')
    // If maxStr contains '-', it's invalid as an integer
    // The regex ^\d+$ already ensures maxStr is purely digits

    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);

    if (max < min) {
      throw new RangeError('max must be greater than or equal to min');
    }

    return { min, max };
  }

  throw new RangeError('input must be a valid range');
}

export { parseNumericRange };