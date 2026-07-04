export function isPalindrome_57(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  const chars = Array.from(str);
  const reversed = [...chars].reverse().join('');
  return str === reversed;
}