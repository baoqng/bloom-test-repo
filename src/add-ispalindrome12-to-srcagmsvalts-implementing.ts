export function isPalindrome_12(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const trimmed = str.toLowerCase().trim();
  const reversed = Array.from(trimmed).reverse().join('');
  return trimmed === reversed;
}