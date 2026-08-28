// bloom-deps:

export function computeLevenshtein(a: unknown, b: unknown): number {
  if (typeof a !== 'string') {
    throw new TypeError('a must be a string');
  }
  if (typeof b !== 'string') {
    throw new TypeError('b must be a string');
  }

  if (a === b) {
    return 0;
  }

  if (a.length === 0) {
    return b.length;
  }

  if (b.length === 0) {
    return a.length;
  }

  const lenA = a.length;
  const lenB = b.length;

  // Use O(min(|a|,|b|)) space by always using the shorter string as columns
  const [shorter, longer] = lenA <= lenB ? [a, b] : [b, a];
  const shortLen = shorter.length;
  const longLen = longer.length;

  // Initialize: previous row represents distances from empty string to prefixes of shorter
  let prevRow = Array.from({ length: shortLen + 1 }, (_, i) => i);
  let currRow = Array(shortLen + 1);

  for (let i = 1; i <= longLen; i++) {
    currRow[0] = i;

    for (let j = 1; j <= shortLen; j++) {
      const cost = longer[i - 1] === shorter[j - 1] ? 0 : 1;

      currRow[j] = Math.min(
        prevRow[j] + 1,      // deletion
        currRow[j - 1] + 1,  // insertion
        prevRow[j - 1] + cost // substitution
      );
    }

    // Swap rows for next iteration
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[shortLen];
}