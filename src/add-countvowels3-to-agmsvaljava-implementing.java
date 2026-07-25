package com.example.agms;

public class AgmsVal {
    
    /**
     * Counts the number of vowels (a, e, i, o, u) in a lowercase string.
     * 
     * @param input the lowercase string to analyze
     * @return the count of vowels in the string
     */
    public static int countVowels_3(String input) {
        if (input == null) {
            return 0;
        }
        
        int vowelCount = 0;
        String vowels = "aeiou";
        
        for (char c : input.toCharArray()) {
            if (vowels.indexOf(c) >= 0) {
                vowelCount++;
            }
        }
        
        return vowelCount;
    }
}