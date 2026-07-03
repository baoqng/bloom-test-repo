export function isPalindrome_2(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  const chars = Array.from(str);
  const reversed = chars.slice().reverse().join('');
  return str === reversed;
}