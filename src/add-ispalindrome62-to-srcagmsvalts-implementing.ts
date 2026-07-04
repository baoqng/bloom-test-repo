export function isPalindrome_62(s: string): boolean {
  const chars = Array.from(s);
  const reversed = [...chars].reverse();
  if (chars.length !== reversed.length) return false;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== reversed[i]) return false;
  }
  // Special rule: if length is odd and middle character is uppercase, return false
  if (chars.length % 2 === 1) {
    const mid = chars[Math.floor(chars.length / 2)];
    if (mid !== mid.toLowerCase()) return false;
  }
  return true;
}