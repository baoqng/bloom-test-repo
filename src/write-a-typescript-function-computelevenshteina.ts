// bloom-deps:

function computeLevenshtein(a: unknown, b: unknown): number {
  if (typeof a !== 'string') throw new TypeError('a must be a string');
  if (typeof b !== 'string') throw new TypeError('b must be a string');

  if (a === b) return 0;
  if (b.length === 0) return a.length;
  if (a.length === 0) return b.length;

  // Ensure we use O(min(a.length, b.length)) space by making the shorter string the column
  let s1: string = a;
  let s2: string = b;
  if (s1.length < s2.length) {
    [s1, s2] = [s2, s1];
  }
  // s2 is now the shorter string; we iterate over rows of s1 and columns of s2

  const m = s1.length;
  const n = s2.length;

  // Two rows: previous and current
  let prev: number[] = new Array(n + 1);
  let curr: number[] = new Array(n + 1);

  // Initialize the first row
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,        // deletion
        curr[j - 1] + 1,    // insertion
        prev[j - 1] + cost  // substitution
      );
    }
    // Swap rows
    const temp = prev;
    prev = curr;
    curr = temp;
  }

  return prev[n];
}

export { computeLevenshtein };