export function isPalindrome_22(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const cleaned = [...str.toLowerCase().trim()];
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}