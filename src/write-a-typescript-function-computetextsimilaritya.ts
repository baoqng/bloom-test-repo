// bloom-deps:

export function computeTextSimilarity(a: unknown, b: unknown): number {
  if (typeof a !== 'string') {
    throw new TypeError('a must be a string');
  }
  if (typeof b !== 'string') {
    throw new TypeError('b must be a string');
  }

  if (a === b) {
    return 1.0;
  }

  if (a.length < 2 || b.length < 2) {
    return 0.0;
  }

  const getBigrams = (str: string): Map<string, number> => {
    const map = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str[i] + str[i + 1];
      map.set(bigram, (map.get(bigram) ?? 0) + 1);
    }
    return map;
  };

  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);

  const countA = a.length - 1;
  const countB = b.length - 1;

  let intersection = 0;
  for (const [bigram, countInA] of bigramsA) {
    const countInB = bigramsB.get(bigram) ?? 0;
    intersection += Math.min(countInA, countInB);
  }

  const dice = (2 * intersection) / (countA + countB);
  return Math.round(dice * 10000) / 10000;
}