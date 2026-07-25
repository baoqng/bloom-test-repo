export function isPalindrome_10(str: string): boolean {
  const chars = Array.from(str);
  const reversed = [...chars].reverse().join('');
  return str === reversed;
}