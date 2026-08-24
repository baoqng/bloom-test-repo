// bloom-deps:

function parseDuration(input: string): number {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new RangeError('input string is empty and contains no recognizable duration units');
  }

  // Check for invalid characters: only digits, letters, whitespace allowed
  if (!/^[\d\w\s]+$/.test(trimmed)) {
    throw new RangeError(`input contains invalid characters: "${input}"`);
  }

  // Match all duration tokens (number + unit)
  const tokenRegex = /(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)/gi;
  const matches = [...trimmed.matchAll(tokenRegex)];

  if (matches.length === 0) {
    throw new RangeError(`input contains no recognizable duration units: "${input}"`);
  }

  // Verify that the matched tokens account for all meaningful content
  // Remove all matched tokens from the string and check what remains
  let remaining = trimmed;
  for (const match of matches) {
    remaining = remaining.replace(match[0], '');
  }
  // After removing all valid tokens, only whitespace should remain
  if (remaining.replace(/\s/g, '').length > 0) {
    throw new RangeError(`input contains invalid characters or unrecognized units: "${input}"`);
  }

  const unitToMs: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  let totalMs = 0;

  for (const match of matches) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    if (!isFinite(value) || value < 0) {
      throw new RangeError(`invalid duration value: "${match[1]}"`);
    }

    const multiplier = unitToMs[unit];
    if (multiplier === undefined) {
      throw new RangeError(`unrecognized unit: "${match[2]}"`);
    }

    totalMs += value * multiplier;
  }

  return totalMs;
}

export { parseDuration };