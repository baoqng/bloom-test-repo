export function isPalindrome_2(s: string): boolean {
  const chars = [...s];
  const reversed = [...chars].reverse().join('');
  return s === reversed;
}