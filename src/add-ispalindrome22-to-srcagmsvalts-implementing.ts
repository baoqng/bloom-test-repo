export function isPalindrome_22(s: string): boolean {
  const chars = Array.from(s);
  const reversed = [...chars].reverse();
  return chars.length === reversed.length && chars.every((c, i) => c === reversed[i]);
}