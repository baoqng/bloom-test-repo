export function isPalindrome_7(s: string): boolean {
  const chars = Array.from(s);
  const reversed = [...chars].reverse().join('');
  const original = chars.join('');
  return original === reversed;
}