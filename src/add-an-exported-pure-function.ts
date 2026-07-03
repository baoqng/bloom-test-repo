export function isPalindrome_10(s: string): boolean {
  const chars = Array.from(s);
  const reversed = [...chars].reverse().join('');
  return s === reversed;
}