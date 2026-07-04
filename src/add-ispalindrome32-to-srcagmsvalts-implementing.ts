export function isPalindrome_32(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  const normalized = str.toLowerCase().trim();
  const reversed = Array.from(normalized).reverse().join('');
  
  return normalized === reversed;
}