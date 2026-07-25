public class AgmsVal {
    
    /**
     * Returns the sum of only the positive numbers in an array.
     * Positive numbers are those greater than 0.
     * 
     * @param numbers the input array of integers
     * @return the sum of positive numbers, or 0 if no positive numbers exist or array is null/empty
     */
    public static int sumPositive_6(int[] numbers) {
        if (numbers == null || numbers.length == 0) {
            return 0;
        }
        
        int sum = 0;
        for (int number : numbers) {
            if (number > 0) {
                sum += number;
            }
        }
        
        return sum;
    }
}