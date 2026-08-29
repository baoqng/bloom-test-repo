// bloom-deps:

function buildEscapedSqlLike(pattern: unknown, escapeChar: unknown): string {
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (typeof escapeChar !== 'string' || escapeChar.length !== 1) {
    throw new TypeError('escapeChar must be a single character');
  }
  if (escapeChar === '%' || escapeChar === '_') {
    throw new RangeError('escapeChar must not be a percent or underscore');
  }

  let result = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === escapeChar) {
      result += escapeChar + escapeChar;
    } else if (ch === '%') {
      result += escapeChar + '%';
    } else if (ch === '_') {
      result += escapeChar + '_';
    } else {
      result += ch;
    }
  }
  return result;
}

export { buildEscapedSqlLike };