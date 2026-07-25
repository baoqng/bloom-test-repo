public class AgmsVal {
    
    /**
     * Checks if a lowercase string reads the same when reversed (palindrome check).
     * 
     * @param str the lowercase string to check
     * @return true if the string is a palindrome, false otherwise
     */
    public static boolean isPalindrome_7(String str) {
        if (str == null) {
            return false;
        }
        
        // Use code points to properly handle Unicode characters (including emojis/surrogate pairs)
        int[] codePoints = str.codePoints().toArray();
        int left = 0;
        int right = codePoints.length - 1;
        
        while (left < right) {
            if (codePoints[left] != codePoints[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
}