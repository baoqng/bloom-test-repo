// bloom-deps:

function computeLevenshtein(a: unknown, b: unknown): number {
  if (typeof a !== 'string') throw new TypeError('a must be a string');
  if (typeof b !== 'string') throw new TypeError('b must be a string');

  if (a === b) return 0;
  if (b.length === 0) return a.length;
  if (a.length === 0) return b.length;

  // Ensure we use O(min(a.length, b.length)) space by making b the shorter string
  if (a.length < b.length) {
    [a, b] = [b, a];
  }

  // a is now the longer string, b is the shorter string
  const bLen = b.length;

  let prev: number[] = new Array(bLen + 1);
  let curr: number[] = new Array(bLen + 1);

  // Initialize previous row
  for (let j = 0; j <= bLen; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost // substitution
      );
    }
    // Swap rows
    [prev, curr] = [curr, prev];
  }

  return prev[bLen];
}

export { computeLevenshtein };