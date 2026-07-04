// bloom-deps:

export function countVowels_13(str: string): number {
  if (typeof str !== 'string') {
    return 0;
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