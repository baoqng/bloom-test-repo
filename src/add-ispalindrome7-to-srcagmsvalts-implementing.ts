// bloom-deps:

export function isPalindrome_7(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const reversed = str.split('').reverse().join('');
  return str === reversed;
}