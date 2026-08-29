// bloom-deps:

function applyWildcardMatch(pattern: unknown, input: unknown): boolean {
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  // Parse pattern into tokens: each token is either a literal char, '?', or '*'
  // Handle escaped \* and \? as literal characters
  type Token = { type: 'literal'; char: string } | { type: 'star' } | { type: 'question' };
  const tokens: Token[] = [];

  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1];
      if (next === '*' || next === '?') {
        tokens.push({ type: 'literal', char: next });
        i += 2;
        continue;
      }
    }
    if (pattern[i] === '*') {
      tokens.push({ type: 'star' });
      i++;
    } else if (pattern[i] === '?') {
      tokens.push({ type: 'question' });
      i++;
    } else {
      tokens.push({ type: 'literal', char: pattern[i] });
      i++;
    }
  }

  // Dynamic programming:
  // dp[t][s] = true if tokens[0..t-1] matches input[0..s-1]
  const T = tokens.length;
  const S = input.length;

  // Use a 2D boolean array
  const dp: boolean[][] = Array.from({ length: T + 1 }, () => new Array(S + 1).fill(false));

  // Empty pattern matches empty input
  dp[0][0] = true;

  // A series of '*' at the start can match empty input
  for (let t = 1; t <= T; t++) {
    if (tokens[t - 1].type === 'star') {
      dp[t][0] = dp[t - 1][0];
    } else {
      break;
    }
  }

  for (let t = 1; t <= T; t++) {
    const token = tokens[t - 1];
    for (let s = 1; s <= S; s++) {
      if (token.type === 'literal') {
        dp[t][s] = dp[t - 1][s - 1] && token.char === input[s - 1];
      } else if (token.type === 'question') {
        // Matches exactly one character
        dp[t][s] = dp[t - 1][s - 1];
      } else if (token.type === 'star') {
        // Matches zero characters: dp[t-1][s]
        // Matches one or more characters: dp[t][s-1]
        dp[t][s] = dp[t - 1][s] || dp[t][s - 1];
      }
    }
    // For star token, also handle zero-length match at s=0
    if (token.type === 'star') {
      dp[t][0] = dp[t - 1][0];
    }
  }

  return dp[T][S];
}

export { applyWildcardMatch };