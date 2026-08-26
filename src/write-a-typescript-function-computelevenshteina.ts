// bloom-deps:

function computeLevenshtein(a: unknown, b: unknown): number {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('Both arguments must be strings');
  }

  if (a.length > 1000 || b.length > 1000) {
    throw new RangeError('Neither string may exceed 1000 characters');
  }

  // Ensure 'shorter' is the one we use for O(min(m,n)) space
  let s1: string = a;
  let s2: string = b;

  if (s1.length < s2.length) {
    [s1, s2] = [s2, s1];
  }

  // s1 is the longer string (length m), s2 is the shorter (length n)
  const m = s1.length;
  const n = s2.length;

  // Edge cases
  if (n === 0) return m;
  if (m === 0) return n;

  // We only need two rows: previous and current
  // prev[j] = edit distance between s1[0..i-1] and s2[0..j-1]
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);

  // Initialize base case: distance from empty string to s2[0..j-1] = j
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    curr[0] = i; // distance from s1[0..i-1] to empty string = i

    for (let j = 1; j <= n; j++) {
      const substitutionCost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,              // deletion
        curr[j - 1] + 1,          // insertion
        prev[j - 1] + substitutionCost // substitution
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