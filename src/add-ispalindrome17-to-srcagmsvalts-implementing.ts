export function isPalindrome_17(s: string): boolean {
  // Only lowercase letters are considered valid palindrome characters
  // Uppercase letters cause the function to return false (case-sensitive requirement)
  // Use Array.from to properly handle Unicode surrogate pairs (emojis)
  
  // Check if string contains any uppercase letters - if so, not a palindrome per spec
  if (/[A-Z]/.test(s)) {
    return false;
  }
  
  const chars = Array.from(s);
  const reversed = [...chars].reverse();
  return chars.every((ch, i) => ch === reversed[i]);
}