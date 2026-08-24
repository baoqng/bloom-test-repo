// bloom-deps:

function parseRange(input: string): { min: number; max: number; inclusive: { min: boolean; max: boolean } } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  const pattern = /^([\[\(])\s*(-?Infinity|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*,\s*(-?Infinity|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*([\]\)])$/;

  const match = trimmed.match(pattern);
  if (!match) {
    throw new SyntaxError(`Invalid range notation: "${input}"`);
  }

  const openBracket = match[1];
  const minStr = match[2];
  const maxStr = match[3];
  const closeBracket = match[4];

  const parseValue = (s: string): number => {
    if (s === 'Infinity') return Infinity;
    if (s === '-Infinity') return -Infinity;
    return parseFloat(s);
  };

  const min = parseValue(minStr);
  const max = parseValue(maxStr);

  if (!isFinite(min) === false && isNaN(min)) {
    throw new SyntaxError(`Invalid min bound: "${minStr}"`);
  }
  if (!isFinite(max) === false && isNaN(max)) {
    throw new SyntaxError(`Invalid max bound: "${maxStr}"`);
  }

  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }

  const inclusiveMin = openBracket === '[';
  const inclusiveMax = closeBracket === ']';

  return {
    min,
    max,
    inclusive: {
      min: inclusiveMin,
      max: inclusiveMax,
    },
  };
}

export { parseRange };