// bloom-deps:
export function countVowels_58(str: string): number {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let count = 0;
  for (const char of str) {
    if (vowels.has(char)) {
      count++;
    }
  }
  return count;
}