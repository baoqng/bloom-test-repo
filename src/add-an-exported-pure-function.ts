// bloom-deps:
export function isPalindrome_10(s: string): boolean {
  const reversed = s.split('').reverse().join('');
  return s === reversed;
}