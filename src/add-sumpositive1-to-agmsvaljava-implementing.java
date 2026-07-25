public class AgmsVal {
    public static int sumPositive_1(int[] arr) {
        if (arr == null) {
            return 0;
        }
        int sum = 0;
        for (int num : arr) {
            if (num > 0) {
                sum += num;
            }
        }
        return sum;
    }
}