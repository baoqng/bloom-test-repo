// bloom-deps:

function computeLevenshtein(a: unknown, b: unknown): number {
  if (typeof a !== 'string') throw new TypeError('a must be a string');
  if (typeof b !== 'string') throw new TypeError('b must be a string');

  if (a === b) return 0;
  if (b.length === 0) return a.length;
  if (a.length === 0) return b.length;

  // Ensure we use the shorter string for columns to minimize space
  let s1: string = a;
  let s2: string = b;

  if (s1.length < s2.length) {
    [s1, s2] = [s2, s1];
  }

  // s2 is the shorter string, s1 is the longer
  const m = s1.length;
  const n = s2.length;

  let prev: number[] = new Array(n + 1);
  let curr: number[] = new Array(n + 1);

  // Initialize prev row
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(
          prev[j],      // deletion
          curr[j - 1],  // insertion
          prev[j - 1]   // substitution
        );
      }
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

export { computeLevenshtein };