// bloom-deps:

export function countVowels_8(str: string): number {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
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