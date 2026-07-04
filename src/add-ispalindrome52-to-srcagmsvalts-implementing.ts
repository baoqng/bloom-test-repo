export function isPalindrome_52(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const trimmedStr = str.toLowerCase().trim();
  const chars = Array.from(trimmedStr);
  const reversed = [...chars].reverse().join('');
  
  return trimmedStr === reversed;
}