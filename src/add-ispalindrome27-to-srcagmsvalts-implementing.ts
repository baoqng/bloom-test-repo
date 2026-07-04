// bloom-deps:

export function isPalindrome_27(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const trimmed = str.toLowerCase().trim();
  let left = 0;
  let right = trimmed.length - 1;

  while (left < right) {
    if (trimmed[left] !== trimmed[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}