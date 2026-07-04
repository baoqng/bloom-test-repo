// bloom-deps:

export function countVowels_18(str: string): number {
  if (typeof str !== 'string') {
    return 0;
  }

  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let count = 0;

  for (const char of str) {
    if (vowels.has(char)) {
      count++;
    }
  }

  return count;
}