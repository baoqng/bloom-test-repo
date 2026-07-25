// bloom-deps:

export function isPalindrome_2(str: string): boolean {
  if (str == null) {
    return false;
  }

  const cleaned = str.toLowerCase().trim();

  if (cleaned.length === 0) {
    return true;
  }

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left += 1;
    right -= 1;
  }

  return true;
}