export function isPalindrome_2(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const normalized = str.toLowerCase();
  const chars = Array.from(normalized);
  const reversed = chars.slice().reverse().join('');
  
  return normalized === reversed;
}