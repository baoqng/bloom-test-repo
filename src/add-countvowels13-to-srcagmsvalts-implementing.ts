// bloom-deps:

export function countVowels_13(str: string): number {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  const vowels = 'aeiou';
  let count = 0;

  for (const char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}