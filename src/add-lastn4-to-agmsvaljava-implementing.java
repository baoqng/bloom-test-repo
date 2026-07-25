public class AgmsVal {
    
    /**
     * Returns the last n elements of an array.
     * 
     * @param array the input array (can be null or empty)
     * @param n the number of elements to return (n >= 0)
     * @param <T> the type of elements in the array
     * @return a new array containing the last n elements, or an empty array if n is greater than array length
     */
    public static <T> T[] lastN_4(T[] array, int n) {
        // Validate input: n must be non-negative
        if (n < 0) {
            throw new IllegalArgumentException("n must be >= 0");
        }
        
        // Handle null or empty array
        if (array == null || array.length == 0) {
            return array != null ? java.util.Arrays.copyOf(array, 0) : (T[]) new Object[0];
        }
        
        // Calculate the starting index for last n elements
        int startIndex = Math.max(0, array.length - n);
        int resultLength = array.length - startIndex;
        
        // Create and populate result array with last n elements
        return java.util.Arrays.copyOfRange(array, startIndex, array.length);
    }
    
    /**
     * Returns the last n elements of an array (primitive int version).
     * 
     * @param array the input array (can be null or empty)
     * @param n the number of elements to return (n >= 0)
     * @return a new array containing the last n elements, or an empty array if n is greater than array length
     */
    public static int[] lastN_4(int[] array, int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be >= 0");
        }
        
        if (array == null || array.length == 0) {
            return new int[0];
        }
        
        int startIndex = Math.max(0, array.length - n);
        int resultLength = array.length - startIndex;
        
        return java.util.Arrays.copyOfRange(array, startIndex, array.length);
    }
    
    /**
     * Returns the last n elements of an array (primitive long version).
     * 
     * @param array the input array (can be null or empty)
     * @param n the number of elements to return (n >= 0)
     * @return a new array containing the last n elements, or an empty array if n is greater than array length
     */
    public static long[] lastN_4(long[] array, int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be >= 0");
        }
        
        if (array == null || array.length == 0) {
            return new long[0];
        }
        
        int startIndex = Math.max(0, array.length - n);
        
        return java.util.Arrays.copyOfRange(array, startIndex, array.length);
    }
    
    /**
     * Returns the last n elements of an array (primitive double version).
     * 
     * @param array the input array (can be null or empty)
     * @param n the number of elements to return (n >= 0)
     * @return a new array containing the last n elements, or an empty array if n is greater than array length
     */
    public static double[] lastN_4(double[] array, int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be >= 0");
        }
        
        if (array == null || array.length == 0) {
            return new double[0];
        }
        
        int startIndex = Math.max(0, array.length - n);
        
        return java.util.Arrays.copyOfRange(array, startIndex, array.length);
    }
    
    /**
     * Returns the last n elements of an array (primitive boolean version).
     * 
     * @param array the input array (can be null or empty)
     * @param n the number of elements to return (n >= 0)
     * @return a new array containing the last n elements, or an empty array if n is greater than array length
     */
    public static boolean[] lastN_4(boolean[] array, int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be >= 0");
        }
        
        if (array == null || array.length == 0) {
            return new boolean[0];
        }
        
        int startIndex = Math.max(0, array.length - n);
        
        return java.util.Arrays.copyOfRange(array, startIndex, array.length);
    }
}